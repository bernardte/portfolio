interface AuthCardProps {
  mode: "login" | "register";
  onToggleMode: (newMode: "login" | "register") => void;
  children: React.ReactNode;
}

export function AuthCard({ mode, onToggleMode, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-8 shadow-xl transition-all">
      {/* 统一 Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          {mode === "login" ? "Login to your account" : "Create an account"}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            type="button"
            onClick={() =>
              onToggleMode(mode === "login" ? "register" : "login")
            }
            className="font-semibold text-indigo-600 underline hover:text-indigo-500"
          >
            {mode === "login" ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
      {/* 渲染具体的 LoginForm 或 RegisterForm */}
      {children}

      {/* 底部版权 */}
      <p className="mt-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
      </p>
    </div>
  );
}
