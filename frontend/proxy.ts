import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode"; // 或者你们后端签发时用的解码方式

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function isExpired(token?: string) {
  if (!token) return true;
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    // 提前 10 秒判定过期，避免临界值竞态
    return Date.now() >= exp * 1000 - 10_000;
  } catch {
    return true;
  }
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (isExpired(accessToken)) {
    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: request.headers.get("cookie") ?? ""
      }
    });

    if (refreshResponse.ok) {
      const setCookies = refreshResponse.headers.getSetCookie();

      // 1. 把新 cookie 合并进【当前请求】的 headers，
      //    这样本次渲染中 cookies() 读到的就是新值
      const requestHeaders = new Headers(request.headers);
      const newCookiePairs = setCookies.map((c) => c.split(";")[0]); // 只取 name=value
      const existingCookie = requestHeaders.get("cookie") ?? "";
      requestHeaders.set(
        "cookie",
        [existingCookie, ...newCookiePairs].filter(Boolean).join("; ")
      );

      const response = NextResponse.next({
        request: { headers: requestHeaders }
      });

      // 2. 同时把新 cookie 写回响应，供浏览器下次请求使用
      setCookies.forEach((cookie) => {
        response.headers.append("Set-Cookie", cookie);
      });

      return response;
    }

    return NextResponse.redirect(
      new URL("/admin/auth?mode=login", request.url)
    );
  }

  return NextResponse.next();
}
