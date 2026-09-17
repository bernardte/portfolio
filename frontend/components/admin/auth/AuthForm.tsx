"use client";

import { useForm } from "@tanstack/react-form-nextjs";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaRegCheckCircle } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import { FieldError } from "@/components/ui/field";
import FormInput from "@/components/share/form/form-controls/FormInput";
import FormButton from "@/components/share/form/form-controls/FormButtton";
import { login, register } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hook/use-toast";

// ==========================================
// 2. 基于 TanStack Form + FormInput 的登录组件
// ==========================================
export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { success, error } = useToast();

  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    onSubmit: async ({ value }) => {
      try {
        const data = await login(value);

        if (data) {
          success("Login successful");

          router.push("/admin");
        }
      } catch (errorMessage: any) {
        error(errorMessage instanceof Error ? errorMessage.message : "Login failed");
      }
    }
  });

  return (
    <form
      id="login-form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) =>
            !value || !/\S+@\S+\.\S+/.test(value)
              ? "Please enter a valid email address"
              : undefined
        }}
      >
        {(field) => (
          <div className="relative">
            <FormInput
              field={field}
              label="Email"
              fieldLabelStyle="mb-1 block text-xs font-semibold tracking-wider uppercase text-slate-700"
              placeholder="you@example.com"
              type="email"
            />
          </div>
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) => (!value ? "Password is required" : undefined)
        }}
      >
        {(field) => (
          <div className="relative">
            <FormInput
              field={field}
              label="Password"
              fieldLabelStyle="mb-1 block text-xs font-semibold tracking-wider uppercase text-slate-700"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[38px] right-3 z-10 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? (
                <FaEyeSlash className="h-4 w-4" />
              ) : (
                <FaEye className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <FormButton
            form="login-form"
            isSubmitting={isSubmitting}
            canSubmit={canSubmit}
            buttonType="submit"
            buttonVariant="default"
            buttonContent={
              <>
                <span>Login</span>
                <ArrowRight size={14} />
              </>
            }
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95 disabled:opacity-50"
          />
        )}
      </form.Subscribe>
    </form>
  );
}

// ==========================================
// 3. 基于 TanStack Form + FormInput 的注册组件
// ==========================================
export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { info, success, error } = useToast();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    onSubmit: async ({ value }) => {
      try {
        if (value.confirmPassword !== value.password) {
          info("Password and confirm password must be the same");
        }

        const data = await register({
          name: value.name,
          email: value.email,
          password: value.password
        });

        if (data) {
          router.push("/admin/auth?mode=login");
          success("Account register sucessfully");
        }

      } catch (errorMessage: any) {
        error(errorMessage instanceof Error ? errorMessage.message : "Login failed");
      }
    }
  });

  return (
    <form
      id="register-form"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => (!value ? "Name is required" : undefined)
        }}
      >
        {(field) => (
          <FormInput
            field={field}
            label="Full Name"
            fieldLabelStyle="mb-1 block text-xs font-semibold tracking-wider uppercase text-slate-700"
            placeholder="John Doe"
          />
        )}
      </form.Field>

      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) =>
            !value || !/\S+@\S+\.\S+/.test(value)
              ? "Please enter a valid email address"
              : undefined
        }}
      >
        {(field) => (
          <FormInput
            field={field}
            label="Email"
            fieldLabelStyle="mb-1 block text-xs font-semibold tracking-wider uppercase text-slate-700"
            placeholder="you@example.com"
            type="email"
          />
        )}
      </form.Field>

      <form.Field
        name="password"
        validators={{
          onChange: ({ value }) =>
            !value || value.length < 8
              ? "Password must be at least 8 characters"
              : undefined
        }}
      >
        {(field) => {
          const passwordVal = field.state.value || "";
          const validations = [
            { label: "At least 8 characters", valid: passwordVal.length >= 8 },
            {
              label: "Include uppercase and lowercase letters",
              valid: /[a-z]/.test(passwordVal) && /[A-Z]/.test(passwordVal)
            },
            {
              label: "Include a number or symbol",
              valid: /[0-9!@#$%^&*]/.test(passwordVal)
            }
          ];

          return (
            <div>
              <div className="relative">
                <FormInput
                  field={field}
                  label="Password"
                  fieldLabelStyle="mb-1 block text-xs font-semibold tracking-wider uppercase text-slate-700"
                  placeholder="Create a password"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-[38px] right-3 z-10 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4" />
                  ) : (
                    <FaEye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* 密码强度提示列表 */}
              <div className="space-y-1.5 pt-2">
                {validations.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <FaRegCheckCircle
                      className={`h-3.5 w-3.5 ${
                        item.valid ? "text-emerald-500" : "text-slate-300"
                      }`}
                    />
                    <span
                      className={
                        item.valid ? "text-slate-600" : "text-slate-400"
                      }
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      </form.Field>

      <form.Field
        name="confirmPassword"
        validators={{
          onChangeListenTo: ["password"],
          onChange: ({ value, fieldApi }) => {
            if (value !== fieldApi.form.getFieldValue("password")) {
              return "Passwords do not match";
            }
            return undefined;
          }
        }}
      >
        {(field) => (
          <FormInput
            field={field}
            label="Confirm Password"
            fieldLabelStyle="mb-1 block text-xs font-semibold tracking-wider uppercase text-slate-700"
            placeholder="Confirm your password"
            type={showPassword ? "text" : "password"}
          />
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <FormButton
            form="register-form"
            isSubmitting={isSubmitting}
            canSubmit={canSubmit}
            buttonType="submit"
            buttonVariant="default"
            buttonContent={
              <>
                <span>Register</span>
                <ArrowRight size={14} />
              </>
            }
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95 disabled:opacity-50"
          />
        )}
      </form.Subscribe>
    </form>
  );
}
