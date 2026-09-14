"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import {
  IconPickerPopover,
  NotionIconDisplay
} from "../../share/icon-picker/IconPickerPopover";
import { DEFAULT_ICON_ID } from "@/lib/icons/icon-library"; // 按你项目实际路径调整这行 import
import { Button } from "@/components/ui/button";
import { skillIconUpload } from "@/lib/api/skill";

export interface CategoryFormValues {
  title: string;
  icon?: string;
  color?: string;
  fileId?: string | null;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => Promise<void> | void;
  initialValues?: CategoryFormValues | null;
  title?: string;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  title
}) => {
  const [name, setName] = useState<string>("");
  const [icon, setIcon] = useState<string>(`icon:${DEFAULT_ICON_ID}`);
  const [iconFileUploaded, setIconFileUploaded] = useState<string | null>(null);
  const [color, setColor] = useState<string>("none");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Icon Popover 触发与状态
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        setName(initialValues.title || "");
        setIcon(initialValues.icon || `icon:${DEFAULT_ICON_ID}`);
        setColor(initialValues.color || "none");
        setIconFileUploaded("");
      } else {
        setName("");
        setIcon(`icon:${DEFAULT_ICON_ID}`);
        setColor("none");
        setIconFileUploaded("");
      }
      setError("");
      setIsPickerOpen(false);
    }
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onSubmit({
        title: name.trim(),
        icon,
        color,
        fileId: iconFileUploaded
      });
      onClose();
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to save category";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleIconChange = (
    newIcon: string,
    newColor?: string,
    fileId?: string
  ) => {
    setIcon(newIcon);
    if (newColor) {
      setColor(newColor);
    }

    if (fileId) {
      setIconFileUploaded(fileId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      {/* 遮罩背景：Popover 打开时不误触发 Modal 关闭 */}
      <div
        className="fixed inset-0"
        onClick={() => {
          if (!isPickerOpen) onClose();
        }}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-100 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-800">
            {title || (initialValues ? "Edit Category" : "Add New Category")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Category Name Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              placeholder="e.g. Frontend, Backend, Tools"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              autoFocus
            />
          </div>

          {/* Icon & Color Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase">
              Category Icon & Accent
            </label>

            <div>
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsPickerOpen((prev) => !prev)}
                className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm transition hover:bg-slate-100/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              >
                <NotionIconDisplay
                  icon={icon}
                  color={color}
                  className="h-4 w-4"
                />
                <span className="font-medium text-slate-700">
                  Select Icon & Accent Color
                </span>
              </button>

              <IconPickerPopover
                mode="Skill Category"
                value={icon}
                color={color}
                triggerRef={triggerRef}
                isOpen={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                onChange={handleIconChange}
                onUpload={(file, category) => skillIconUpload(file, category)}
              />
            </div>
          </div>

          {/* Card Preview */}
          <div className="space-y-1.5">
            <span className="block text-[11px] font-medium tracking-wider text-slate-400 uppercase">
              Card Preview
            </span>
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-3">
              <NotionIconDisplay
                icon={icon}
                color={color}
                className="h-5 w-5"
              />
              <span className="text-sm font-semibold text-slate-800">
                {name.trim() || "Category Name"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
              <Button
                type="button"
                onClick={onClose}
                disabled={loading}
                variant="ghost"
                className="text-brand-primary border-brand-accent hover:text-brand-accent rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                variant="default"
                className="bg-brand-primary hover:bg-brand-accent min-w-[140px] rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{initialValues ? "Save Changes" : "Create Category"}</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
