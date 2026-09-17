const API_URL =
  typeof window === "undefined" ? process.env.BACKEND_URL : "/api/backend";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(true);
    }
  });
  failedQueue = [];
};

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const isFormData = options?.body instanceof FormData;

  const requestConfig: RequestInit = {
    ...options,
    cache: "no-store",
    credentials: "include", // 让浏览器自动带上所有的 HttpOnly Cookie
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options?.headers
    }
  };

  // 1. 直接发起 API 请求
  let response = await fetch(`${API_URL}${endpoint}`, requestConfig);

  // 2. 如果收到 401（Access Token 过期），尝试无感刷新
  // 排除所有认证接口，防止进入死循环
  const isAuthEndpoint = endpoint.startsWith("/auth/");

  if (response.status === 401 && !isAuthEndpoint) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        return apiClient<T>(endpoint, options);
      });
    }

    isRefreshing = true;

    try {
      // ----------------- 修改开始 -----------------
      // 原来是：await apiClient("/auth/refresh", ...)
      // 改为：直接用原生 fetch 请求，避免层层封装和拦截干扰 Cookie 存取
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include" // 确保带上 Cookie
      });

      if (!refreshRes.ok) {
        throw new Error("Refresh token invalid or expired");
      }
      // ----------------- 修改结束 -----------------

      processQueue(null);

      // 重新发起原始请求（此时浏览器已自动更新 accessToken Cookie）
      response = await fetch(`${API_URL}${endpoint}`, requestConfig);
    } catch (refreshError) {
      console.error("🚨 REDIRECTING TO LOGIN");
      console.error("endpoint:", endpoint);
      console.error("refresh error:", refreshError);

      processQueue(refreshError);

      if (typeof window !== "undefined") {
        // 重定向至登录页
        window.location.href = "/admin/auth?mode=login";
        // 返回 pending 状态的 Promise，切断后续代码执行，消除控制台 Uncaught Error
        return new Promise(() => {}) as Promise<T>;
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  if (response.status === 204) {
    return {} as T;
  }

  // 3. 结果解析
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      Array.isArray(data.message)
        ? data.message[0]
        : data.message || "Something went wrong"
    );
  }

  return data as T;
}
