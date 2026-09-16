import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function isExpired(token?: string) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() >= exp * 1000 - 10_000;
  } catch {
    return true;
  }
}

/** 按 cookie name 覆盖合并，避免同名 cookie 重复导致读到旧值 */
function mergeCookies(existing: string, setCookies: string[]) {
  const map = new Map<string, string>();

  const put = (pair: string) => {
    const trimmed = pair.trim();
    const i = trimmed.indexOf("=");
    if (i <= 0) return;
    map.set(trimmed.slice(0, i), trimmed.slice(i + 1));
  };

  existing.split(";").forEach(put);
  // Set-Cookie 形如 "accessToken=xxx; Path=/; HttpOnly"，只取第一段
  setCookies.forEach((c) => put(c.split(";")[0]));

  return Array.from(map, ([k, v]) => `${k}=${v}`).join("; ");
}

function redirectToLogin(request: NextRequest) {
  const url = new URL("/admin/auth", request.url);
  url.searchParams.set("mode", "login");
  // 登录后跳回原来想去的页面
  url.searchParams.set("next", request.nextUrl.pathname);

  const response = NextResponse.redirect(url);
  // 清掉失效凭证，否则下次进来又会重试一次 refresh
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 认证页放行（?mode=login / ?mode=register 不影响，query 不属于 pathname）
  if (pathname.startsWith("/admin/auth")) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  if (!isExpired(accessToken)) {
    return NextResponse.next();
  }

  // 连 refreshToken 都没有，直接去登录，省一次无谓的后端请求
  if (!request.cookies.get("refreshToken")) {
    return redirectToLogin(request);
  }

  let refreshResponse: Response;
  try {
    refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { Cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store"
    });
  } catch {
    // 后端挂了 / 网络异常，不要当成凭证失效把用户 cookie 清掉
    return NextResponse.redirect(
      new URL("/admin/auth?mode=login", request.url)
    );
  }

  if (!refreshResponse.ok) {
    return redirectToLogin(request);
  }

  const setCookies = refreshResponse.headers.getSetCookie();
  if (setCookies.length === 0) {
    // 后端返回 200 但没下发新 cookie，视为刷新失败
    return redirectToLogin(request);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    "cookie",
    mergeCookies(request.headers.get("cookie") ?? "", setCookies)
  );

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  setCookies.forEach((c) => response.headers.append("Set-Cookie", c));
  return response;
}

export const config = {
  matcher: ["/admin/:path*"]
};
