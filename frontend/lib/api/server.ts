import { cookies } from "next/headers";

const API_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function serverFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const cookieStore = await cookies();

  // 手动拼接 Cookie 字符串，防止 toString() 解析异常
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const isFormData = options?.body instanceof FormData;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    cache: "no-store",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Cookie: cookieHeader, // 👈 使用稳健拼接的 Cookie
      ...options?.headers
    }
  });

  // 处理 204 No Content（无响应体）
  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    throw new Error(
      Array.isArray(data.message)
        ? data.message[0]
        : data.message || "Something went wrong"
    );
  }

  return data as T;
}
