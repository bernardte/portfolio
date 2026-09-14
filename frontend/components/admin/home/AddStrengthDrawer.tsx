"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "@tanstack/react-form-nextjs";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import FormInput from "@/components/share/form/form-controls/FormInput";
import FormTextarea from "@/components/share/form/form-controls/FormTextarea";
import FormButtton from "@/components/share/form/form-controls/FormButtton";
import { ChevronDown } from "lucide-react";
import {
  IconPickerPopover,
  NotionIconDisplay
} from "@/components/share/icon-picker/IconPickerPopover"; // 按实际路径调整
import { StrengthsResponse } from "@/lib/interface/strength.interface";
import { uploadStrengthIcon } from "@/lib/api/strength";

interface AddStrengthDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: StrengthsResponse | null;
  onSubmit: (
    data: Omit<StrengthsResponse, "id" | "createdAt" | "updatedAt"> & {
      id?: string;
    }
  ) => Promise<StrengthsResponse>;
  profileId: string;
}

interface FormValues {
  title: string;
  description: string;
  icon: string;
  color: string;
  fileId?: string | null;
}

const DEFAULT_ICON = "icon:Lightbulb"; // 与 icon-library 里的图标 id 对齐
const DEFAULT_COLOR = "none";

export default function AddStrengthDrawer({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  profileId
}: AddStrengthDrawerProps) {
  const isEditing = Boolean(initialData);
  const iconTriggerRef = useRef<HTMLButtonElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const getDefaultValues = (): FormValues => ({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    icon: initialData?.icon ?? DEFAULT_ICON,
    color: initialData?.color ?? DEFAULT_COLOR
  });

  const form = useForm({
    defaultValues: getDefaultValues(),

    onSubmit: async ({ value }) => {
      const payload: Omit<
        StrengthsResponse,
        "id" | "createdAt" | "updatedAt"
      > & {
        id?: string;
        fileId?: string;
      } = {
        id: initialData?.id,
        title: value.title.trim(),
        description: value.description.trim(),
        icon: value.icon,
        color: value.color,
        sortOrder: 0,
        profileId: initialData?.profileId ?? "",
        fileId: value.fileId ?? undefined
      };

      await onSubmit(payload);
      onOpenChange(false);
    }
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <form
          id="strength-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="mx-auto w-full max-w-2xl"
        >
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-lg">
              {isEditing ? "Edit Strength" : "Add Strength"}
            </DrawerTitle>
            <DrawerDescription>
              {isEditing
                ? "Update this strength's details."
                : "Showcase a skill or trait on your profile."}
            </DrawerDescription>
          </DrawerHeader>

          <div className="grid grid-cols-1 gap-8 px-4 pb-2 md:grid-cols-[260px_1fr]">
            {/* 左列：实时预览 */}
            <div className="md:sticky md:top-4 md:self-start">
              <form.Subscribe
                selector={(state) => [
                  state.values.title,
                  state.values.description,
                  state.values.icon,
                  state.values.color
                ]}
              >
                {([title, description, icon, color]) => (
                  <div className="border-border/60 bg-muted/20 rounded-xl border p-4">
                    <span className="text-muted-foreground/70 mb-3 block text-[11px] font-medium tracking-wide uppercase">
                      Preview
                    </span>
                    <div className="flex items-center gap-3">
                      <NotionIconDisplay
                        icon={icon as string}
                        color={color as string}
                        className="h-4 w-4"
                      />
                      <div className="min-w-0">
                        <p className="text-foreground text-sm font-semibold break-words">
                          {(title as string).trim() || "Your strength title"}
                        </p>
                        <p className="text-muted-foreground mt-0.5 text-xs break-words">
                          {(description as string).trim() ||
                            "A short description will show up here"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </form.Subscribe>

              <p className="text-muted-foreground/70 mt-3 hidden text-xs md:block">
                This is exactly how the strength card will appear on your
                profile.
              </p>
            </div>

            {/* 右列：字段 */}
            <div className="space-y-5">
              <form.Field
                name="title"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim() ? "Title is required" : undefined
                }}
              >
                {(field) => (
                  <FormInput
                    field={field}
                    label="Title"
                    fieldLabelStyle="text-sm font-medium"
                    placeholder="e.g. Problem Solving"
                  />
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <FormTextarea
                    field={field}
                    label="Description"
                    fieldLabelStyle="text-sm font-medium"
                    placeholder="Short description of this strength"
                    rows={3}
                  />
                )}
              </form.Field>

              {/* icon + color 用同一个 Picker，onChange 里同时更新两个字段 */}
              <form.Subscribe
                selector={(state) => [state.values.icon, state.values.color]}
              >
                {([icon, color]) => (
                  <div className="space-y-1.5">
                    <span className="text-sm font-medium">Icon</span>
                    <button
                      ref={iconTriggerRef}
                      type="button"
                      onClick={() => setPickerOpen((prev) => !prev)}
                      className="border-border/60 hover:bg-muted/50 flex w-full items-center justify-between rounded-lg border px-3 py-2 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <NotionIconDisplay
                          icon={icon as string}
                          color={color as string}
                          className="h-4 w-4"
                        />
                        <span className="text-muted-foreground text-sm">
                          Choose an icon or emoji
                        </span>
                      </div>
                      <ChevronDown className="text-muted-foreground/60 h-3.5 w-3.5" />
                    </button>

                    <IconPickerPopover
                      value={icon as string}
                      color={color as string}
                      triggerRef={iconTriggerRef}
                      isOpen={pickerOpen}
                      onClose={() => setPickerOpen(false)}
                      onChange={(newIcon, newColor, fileId) => {
                        form.setFieldValue("icon", newIcon);
                        if (newColor !== undefined) {
                          form.setFieldValue("color", newColor);
                        }

                        if (fileId !== undefined) {
                          form.setFieldValue("fileId", fileId);
                        }
                      }}
                      onUpload={(file) => uploadStrengthIcon(profileId, file)}
                    />
                  </div>
                )}
              </form.Subscribe>
            </div>
          </div>

          <DrawerFooter className="flex-row justify-end gap-2 border-t pt-4">
            <FormButtton
              buttonType="button"
              buttonVariant="outline"
              isSubmitting={false}
              canSubmit
              buttonContent="Cancel"
              className="order-1"
              onClick={() => onOpenChange(false)}
            />
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <FormButtton
                  form="strength-form"
                  buttonType="submit"
                  buttonVariant="default"
                  isSubmitting={isSubmitting as boolean}
                  canSubmit={canSubmit as boolean}
                  buttonContent={isEditing ? "Save Changes" : "Add Strength"}
                  className="order-2"
                />
              )}
            </form.Subscribe>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
