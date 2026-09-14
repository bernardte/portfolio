export function objectToFormData(
  obj: Record<string, any>,
  formData: FormData = new FormData(),
  parentKey: string | null
) {
  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value instanceof File || value instanceof Blob) {
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      if (value.every((v) => v instanceof File)) {
        value.forEach((file) => formData.append(formKey, file));
      } else {
        formData.append(formKey, JSON.stringify(value));
      }
    } else if (typeof value === "boolean" || typeof value === "number") {
      formData.append(formKey, String(value));
    } else if (typeof value === "object") {
      objectToFormData(value, formData, formKey);
    } else {
      formData.append(formKey, value);
    }
  });

  return formData;
}
