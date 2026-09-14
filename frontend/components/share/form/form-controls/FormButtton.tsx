import { LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComponentProps, ReactNode } from "react";

interface FormButtonProps {
  form?: string;
  isSubmitting: boolean;
  canSubmit: boolean;
  buttonType: ComponentProps<typeof Button>["type"];
  buttonVariant: ComponentProps<typeof Button>["variant"];
  className?: string;
  buttonContent?: ReactNode;
  onClick?: ComponentProps<typeof Button>["onClick"];
}

export default function FormButtton({
  form,
  isSubmitting,
  canSubmit,
  buttonType,
  buttonVariant,
  className,
  buttonContent,
  onClick,
}: FormButtonProps) {
  return (
    <Button
      form={form}
      type={buttonType}
      variant={buttonVariant}
      disabled={isSubmitting || !canSubmit}
      className={className}
      onClick={onClick}
    >
      {isSubmitting ? (
        <div className="flex items-center justify-center gap-2">
          Loading
          <LoaderIcon className="size-5 animate-spin" />
        </div>
      ) : (
        <>{buttonContent}</>
      )}
    </Button>
  );
}
