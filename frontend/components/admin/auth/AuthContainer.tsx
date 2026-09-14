"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AuthCard } from "./AuthCard";
import { LoginForm } from "./AuthForm";
import { RegisterForm } from "./AuthForm";

export function AuthContainer() {
  function newSearchParams(queryString: string) {
    return new URLSearchParams(queryString);
  }

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 读取 URL 参数 ?mode=login 或 ?mode=register，默认 fallback 到 login
  const rawMode = searchParams.get("mode");
  const mode: "login" | "register" =
    rawMode === "register" ? "register" : "login";

  // 无刷新更新 URL query
  const handleToggleMode = (newMode: "login" | "register") => {
    const params = newSearchParams(searchParams.toString());
    params.set("mode", newMode);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <AuthCard mode={mode} onToggleMode={handleToggleMode}>
      {mode === "login" ? <LoginForm /> : <RegisterForm />}
    </AuthCard>
  );
}
