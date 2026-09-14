import type { AnyFieldApi } from "@tanstack/react-form-nextjs";
import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import FormField from "../FormField";
import { ReactNode } from "react";

type FormInputProps = {
  field: AnyFieldApi;
  label: string;
  fieldLabelStyle: string;
  icon?: ReactNode;
} & Omit<
  ComponentProps<typeof Input>,
  "name" | "value" | "onChange" | "onBlur"
>;

export default function FormInput({
  field,
  label,
  fieldLabelStyle,
  icon,
  ...props
}: FormInputProps) {

  return (
    <FormField field={field} label={label} fieldLabelStyle={fieldLabelStyle}>
      {/* Anonymous function */}
      {({ id, name, value, isInvalid, onBlur, onChange }) => (
        <div className="relative w-full">
          <Input
            {...props}
            id={id}
            name={name}
            value={value}
            aria-invalid={isInvalid}
            onBlur={onBlur}
            onChange={(e) => onChange(e.target.value)}
  
          />
          {icon && (
            <div className="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2">
              {icon}
            </div>
          )}
        </div>
      )}
    </FormField>
  );
}
