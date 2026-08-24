// ContactForm.tsx
"use client";
import { useState } from "react";
import FormInput from "../share/form/form-controls/FormInput";
import { useForm } from "@tanstack/react-form-nextjs";
import FormTextarea from "../share/form/form-controls/FormTextarea";
import { CheckCircle2, Send, XCircle } from "lucide-react";
import FormButtton from "../share/form/form-controls/FormButtton";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmitStatus = "idle" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    },
    onSubmit: async ({ value }) => {
      setStatus("idle");
      try {
        // Replace with your actual submit call (server action / API route)
        // await sendContactMessage(value);
        console.log(value);
        setStatus("success");

        setTimeout(() => {
          setStatus("idle");
        }, 2000);

        form.reset();
      } catch (err) {
        setStatus("error");
      }
    }
  });

const inputClassName =
  "w-full bg-brand-bg/40 text-md border-brand-accent/20 focus-visible:ring-brand-primary focus-visible:border-brand-primary rounded-md px-4 py-5 text-white placeholder:text-neutral-500 transition-colors";
  
  return (
    <form
      id="contact-us-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="bg-brand-accent/5 grid grid-cols-1 gap-4 rounded-md p-5 sm:grid-cols-2">
        <form.Field
          name="name"
          validators={{
            onBlur: ({ value }) =>
              value.trim().length === 0 ? "Please enter your name" : undefined
          }}
        >
          {(field) => (
            <div>
              <FormInput
                field={field}
                label={"Your Name"}
                placeholder={"John Doe"}
                fieldLabelStyle="text-neutral-400"
                autoComplete={"name"}
                className={inputClassName}
                aria-invalid={field.state.meta.errors.length > 0}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-xs text-red-400">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onBlur: ({ value }) => {
              if (value.trim().length === 0) return "Please enter your email";
              if (!EMAIL_REGEX.test(value))
                return "Enter a valid email address";
              return undefined;
            }
          }}
        >
          {(field) => (
            <div>
              <FormInput
                field={field}
                label={"Your Email"}
                fieldLabelStyle="text-neutral-400"
                placeholder={"john@example.com"}
                autoComplete={"email"}
                className={inputClassName}
                aria-invalid={field.state.meta.errors.length > 0}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="mt-1 text-xs text-red-400">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <div className="col-span-full">
          <form.Field
            name="subject"
            validators={{
              onBlur: ({ value }) =>
                value.trim().length === 0 ? "Please add a subject" : undefined
            }}
          >
            {(field) => (
              <div>
                <FormInput
                  field={field}
                  label={"Subject"}
                  fieldLabelStyle={"text-neutral-400"}
                  placeholder={"Let's work together"}
                  autoComplete={"off"}
                  className={inputClassName}
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="mt-1 text-xs text-red-400">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <div className="col-span-full">
          <form.Field
            name="message"
            validators={{
              onBlur: ({ value }) =>
                value.trim().length === 0 ? "Please enter a message" : undefined
            }}
          >
            {(field) => (
              <div>
                <div className="flex items-baseline justify-between">
                  <FormTextarea
                    field={field}
                    rows={4}
                    label={"Message"}
                    fieldLabelStyle={"text-neutral-400"}
                    placeholder={"Hello Yu Hang, I would like to..."}
                    autoComplete={"off"}
                    maxLength={500}
                    className={`max-h-[200px] resize-none overflow-y-auto ${inputClassName}`}
                    aria-invalid={field.state.meta.errors.length > 0}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between">
                  {field.state.meta.errors.length > 0 ? (
                    <p className="text-xs text-red-400">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-neutral-500">
                    {field.state.value.length}/500
                  </span>
                </div>
              </div>
            )}
          </form.Field>
        </div>

        {/* Status feedback */}
        {status === "success" && (
          <div className="col-span-full flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm text-green-400">
            <CheckCircle2 size={16} />
            Your message has been sent. I'll get back to you soon.
          </div>
        )}
        {status === "error" && (
          <div className="col-span-full flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            <XCircle size={16} />
            Something went wrong sending your message. Please try again.
          </div>
        )}

        {/* Submit button */}
        <div className="col-span-full flex justify-end">
          <form.Subscribe
            selector={(state) => [state.isSubmitting, state.canSubmit] as const}
          >
            {([isSubmitting, canSubmit]) => (
              <FormButtton
                isSubmitting={isSubmitting}
                canSubmit={canSubmit}
                iconComponent={Send}
                buttonType={"submit"}
                buttonVariant={"default"}
                className={""}
              />
            )}
          </form.Subscribe>
        </div>
      </div>
    </form>
  );
}
