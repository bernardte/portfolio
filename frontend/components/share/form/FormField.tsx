import type { AnyFieldApi } from "@tanstack/react-form-nextjs";
import type { ReactNode } from "react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

type FormFieldProps = {
  field: AnyFieldApi;
  label: string;
  className?: string;
  fieldLabelStyle?: string;
  children: (props: {
    id: string;
    name: string;
    value: string;
    isInvalid: boolean;
    inputLabelStyle?: string;
    className?: string;
    onBlur?: () => void;
    onChange: (value: string) => void;
  }) => ReactNode;
};

export default function FormField({
  field,
  label,
  children,
  fieldLabelStyle
}: FormFieldProps) {
  const errors = field.state.meta.errors;
  const isInvalid = field.state.meta.isTouched && errors.length > 0;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name} className={fieldLabelStyle}>
        {label}
      </FieldLabel>
      {children({
        id: field.name,
        name: field.name,
        value: field.state.value,
        isInvalid: isInvalid,
        onBlur: field.handleBlur,
        onChange: field.handleChange
      })}
      {isInvalid && <FieldError>{field.state.meta.errors[0]}</FieldError>}
    </Field>
  );
}
