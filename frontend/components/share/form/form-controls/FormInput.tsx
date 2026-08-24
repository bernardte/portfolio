import type { AnyFieldApi } from "@tanstack/react-form-nextjs";
import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import FormField from "../FormField";

type FormInputProps = {
  field: AnyFieldApi;
  label: string;
  fieldLabelStyle: string;
} & Omit<
  ComponentProps<typeof Input>,
  "name" | "value" | "onChange" | "onBlur"
>;

export default function FormInput({
  field,
  label,
  fieldLabelStyle,
  ...props
}: FormInputProps) {
  return (
    <FormField field={field} label={label} fieldLabelStyle={fieldLabelStyle}>
        {/* Anonymous function */}
      {({ id, name, value, isInvalid, onBlur, onChange }) => (
        <Input
          {...props}
          id={id}
          name={name}
          value={value}
          aria-invalid={isInvalid}
          onBlur={onBlur}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </FormField>
  );
}
