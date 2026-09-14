"use client";

import { useState, useEffect, useRef } from "react";
import { X, Wrench, Loader2 } from "lucide-react";
import { IconPickerPopover } from "../../share/icon-picker/IconPickerPopover";
import { DEFAULT_ICON_ID } from "@/lib/icons/icon-library";
import { NotionIconDisplay } from "../../share/icon-picker/IconPickerPopover";
import { SkillItemResponse } from "@/lib/interface/skill.interface";
import { skillIconUpload } from "@/lib/api/skill";

export interface SkillItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SkillItemFormValues) => Promise<void> | void;
  categoryId: string;
  initialValues?: SkillItemResponse | null;
}

export interface SkillItemFormValues {
  title: string;
  icon: string | null;
  categoryId: string;
  color: string | null;
  fileId: string;
}

export const SkillItemModal: React.FC<SkillItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categoryId,
  initialValues
}) => {
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [iconFileUpload, setIconFileUpload] = useState<string>("");
  const [icon, setIcon] = useState<string>(`icon:${DEFAULT_ICON_ID}`);
  const [color, setColor] = useState<string>("none");
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        setTitle(initialValues.title || "");
        setIcon(initialValues.icon || "");
        setColor(initialValues.color || "none");
        setIconFileUpload("");
      } else {
        setIcon(`icon:${DEFAULT_ICON_ID}`);
        setColor("none");
        setTitle("");
        setIcon("");
        setIconFileUpload("");
      }
      setError("");
    }
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Skill title is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onSubmit({
        title: title.trim(),
        icon: icon.trim(),
        categoryId,
        fileId: iconFileUpload,
        color: color
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save skill");
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
      setIconFileUpload(fileId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-800">
            {initialValues ? "Edit Skill Item" : "Add New Skill Item"}
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase">
              Skill Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. React, PostgreSQL, Docker"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase">
              Skill Icon & Accent
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
                mode="Skill Category Item"
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

          {/* Preview */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold tracking-wider text-slate-700/40 uppercase">
              Skill Item Card Preview 
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-3">
              <NotionIconDisplay
                icon={icon}
                color={color}
                size="sm"
                variant="boxed"
              />
              <span className="text-sm font-semibold text-slate-800">
                {title.trim() || "Skill Name"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {initialValues ? "Save Changes" : "Add Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
