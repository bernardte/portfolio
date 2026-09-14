import { AnyFieldApi } from "@tanstack/react-form-nextjs";
import FormField from "../FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SelectOption = {
  label: string;
  value: string;
};

type FormSelectProps = {
  field: AnyFieldApi;
  label: string;
  fieldLabelStyle?: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
};

export default function FormSelect({
  field,
  label,
  fieldLabelStyle,
  placeholder = "Select an option",
  options,
  disabled = false,
  icon,
  className
}: FormSelectProps) {
  return (
    <FormField field={field} label={label} fieldLabelStyle={fieldLabelStyle}>
      {({ name, value, isInvalid, onChange, onBlur }) => (
        <Select
          name={name}
          value={value || ""}
          onValueChange={(val) => {
            if (val) onChange(val);
            onBlur?.();
          }}
          disabled={disabled}
        >
          <SelectTrigger
            data-invalid={isInvalid}
            className={cn(
              "focus:ring-brand-primary flex w-full items-center gap-2.5 border-slate-200 text-sm",
              className
            )}
          >
            {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );
}
