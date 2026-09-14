import { AnyFieldApi } from "@tanstack/react-form-nextjs";
import FormField from "../FormField";
import { ComponentProps } from "react";
import { Textarea } from "@/components/ui/textarea";
interface FormTextarea extends Omit<
  ComponentProps<typeof Textarea>,
  "name" | "value" | "onChange" | "onBlur"
> {
  field: AnyFieldApi;
  label: string;
  fieldLabelStyle: string;
}

export default function FormTextarea({
  field,
  label,
  fieldLabelStyle,
  ...props
}: FormTextarea) {
  return (
    <FormField field={field} label={label} fieldLabelStyle={fieldLabelStyle}>
      {({ id, name, isInvalid, onBlur, onChange, value }) => (
        <Textarea
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
