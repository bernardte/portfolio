"use client";

import { useRef, useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "@tanstack/react-form-nextjs";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Pencil,
  Plus,
  UploadCloud,
  X
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import FormField from "@/components/share/form/FormField";
import FormInput from "@/components/share/form/form-controls/FormInput";
import FormTextarea from "@/components/share/form/form-controls/FormTextarea";
import FormButtton from "@/components/share/form/form-controls/FormButtton";
import OrderPositionPicker, {
  type ExistingProject
} from "@/components/admin/projects/OrderPositionPicker";
import {
  createProjectApi,
  updateProjectApi,
  reorderProjectApi
} from "@/lib/api/project";
import { useToast } from "@/hook/use-toast";

const TITLE_MAX = 50;
// 建议确认这个上限，20 字符基本写不了一句完整描述，这里先按 120 处理
const DESCRIPTION_MAX = 200;
const MAX_IMAGE_SIZE_MB = 5;
const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

interface FormValues {
  projectTitle: string;
  projectDescription: string;
  projectTechStack: string[];
  projectLiveDemoUrl: string | undefined;
  projectRepositoryUrl: string | undefined;
  isPublic: boolean;
}

export interface ProjectFormInitialValues extends FormValues {
  projectThumbnailImage: string;
  sortOrder: number;
}

interface ProjectFormProps {
  mode: "create" | "edit";
  // edit 模式必传，用来拼接 PATCH 的地址
  projectId?: string;
  // 不包含当前正在创建/编辑的这个项目，父级 server component fetch 好传进来
  existingProjects: ExistingProject[];
  // edit 模式下由父级传入，预填表单和缩略图
  initialValues?: ProjectFormInitialValues;
}

export default function ProjectForm({
  mode,
  projectId,
  existingProjects,
  initialValues
}: ProjectFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  // create 模式初始为空；edit 模式直接拿已有的图片链接当预览，
  // 用户不重新选图的话就一直用这个链接，不强制重新上传。
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialValues?.projectThumbnailImage ?? null
  );
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [techInput, setTechInput] = useState("");
  // create 模式：sortOrder 直接和 createProjectApi 一起发送
  // edit 模式：sortOrder 只用于 UI 展示，真正的顺序更新走 orderedIds + reorderProjectApi
  const [sortOrder, setSortOrder] = useState(
    initialValues?.sortOrder ?? existingProjects.length
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  // edit 模式下，当前完整顺序对应的真实项目 id 数组；
  // 只有用户真的拖动过顺序才会被设置，用来在保存时调用 reorderProjectApi。
  const [orderedIds, setOrderedIds] = useState<string[] | null>(null);
  const { success, error } = useToast();

  const form = useForm({
    defaultValues: {
      projectTitle: initialValues?.projectTitle ?? "",
      projectDescription: initialValues?.projectDescription ?? "",
      projectTechStack: initialValues?.projectTechStack ?? [],
      projectLiveDemoUrl: initialValues?.projectLiveDemoUrl ?? "",
      projectRepositoryUrl: initialValues?.projectRepositoryUrl ?? "",
      isPublic: initialValues?.isPublic ?? true
    } as FormValues,
    onSubmit: async ({ value }) => {
      setSubmitError(null);

      if (!thumbnailFile && !thumbnailPreview) {
        setImageError("Upload a thumbnail image");
        return;
      }

      try {
        // 没选新图时，edit 模式直接沿用已有的 URL，不用重新上传
        if (mode === "create") {
          if (!thumbnailFile) {
            setImageError("Please select a project thumbnail");
          }

          const payload = {
            ...value,
            projectLiveDemoUrl: value.projectLiveDemoUrl?.trim() || undefined,
            projectRepositoryUrl:
              value.projectRepositoryUrl?.trim() || undefined
          };

          const response = await createProjectApi({
            ...payload,
            projectThumbnailImage: thumbnailFile,
            sortOrder
          });

          if (response) {
            success(`Project ${value.projectTitle} created successfully!`);
          }
        } else if (mode === "edit") {
          if (!projectId) return;

          // 排序和详情编辑拆成两个独立请求：
          // updateProjectApi 只负责标题/描述/链接等普通字段，不再携带 sortOrder。
          const response = await updateProjectApi(projectId, {
            ...value,
            projectLiveDemoUrl: value.projectLiveDemoUrl?.trim() || undefined,
            projectRepositoryUrl:
              value.projectRepositoryUrl?.trim() || undefined,
            projectThumbnailImage: thumbnailFile
          });

          // 只有用户真的拖动过顺序（orderedIds 才会非空）才发起 reorder 请求，
          // orderedIds 已经是完整、真实的项目 id 顺序数组，后端据此批量重写所有项目的 sortOrder。
          if (orderedIds) {
            await reorderProjectApi(orderedIds);
          }

          if (response) {
            success(`Project ${response.projectTitle} updated successfully!`);

            form.reset({
              projectTitle: response.projectTitle ?? "",
              projectDescription: response.projectDescription ?? "",
              projectTechStack: response.projectTechStack ?? [],
              projectLiveDemoUrl: response.projectLiveDemoUrl ?? "",
              projectRepositoryUrl: response.projectRepositoryUrl ?? "",
              isPublic: response.isPublic ?? true
            });
          }
        }

        router.push("/admin/projects");
        router.refresh();
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      }
    }
  });

  function handleFile(file: File | undefined) {
    if (!file) return;
    setImageError(null);

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Use a PNG, JPG, or WebP image");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setImageError(`Image must be under ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDraggingImage(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  function removeThumbnail() {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  }

  const formId = `project-form-${mode}`;
  const isEdit = mode === "edit";

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/projects"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* 左侧：表单 */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-8">
              <h1 className="text-xl font-semibold tracking-tight text-gray-900">
                {isEdit ? "Edit project" : "New project"}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {isEdit
                  ? "Update the details below and save your changes."
                  : "Fill in the details below — it'll appear in your portfolio once saved."}
              </p>
            </div>

            {submitError && (
              <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-sm text-red-600">
                {submitError}
              </div>
            )}

            <form
              id={formId}
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              {/* 缩略图上传 */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">
                  Thumbnail
                </Label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />

                {thumbnailPreview ? (
                  <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200">
                    <Image
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                      >
                        <X className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingImage(true);
                    }}
                    onDragLeave={() => setIsDraggingImage(false)}
                    onDrop={handleDrop}
                    role="button"
                    className={`flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors ${
                      isDraggingImage
                        ? "border-indigo-400 bg-indigo-50/60"
                        : "border-gray-200 bg-gray-50/60 hover:border-gray-300"
                    }`}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                      {isDraggingImage ? (
                        <UploadCloud className="h-4 w-4 text-indigo-600" />
                      ) : (
                        <ImagePlus className="h-4 w-4 text-gray-400" />
                      )}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      Click to upload, or drag and drop
                    </span>
                    <span className="text-xs text-gray-400">
                      PNG, JPG or WebP — up to {MAX_IMAGE_SIZE_MB}MB
                    </span>
                  </div>
                )}

                {imageError && (
                  <p className="text-xs text-red-500">{imageError}</p>
                )}
              </div>

              {/* 项目名称 */}
              <form.Field
                name="projectTitle"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim()
                      ? "Project name is required"
                      : value.length > TITLE_MAX
                        ? `Must be under ${TITLE_MAX} characters`
                        : undefined
                }}
              >
                {(field) => (
                  <FormInput
                    field={field}
                    label="Project name"
                    fieldLabelStyle="text-sm font-medium text-gray-700"
                    maxLength={TITLE_MAX}
                    placeholder="Smart Travel Planner"
                    className="h-11 rounded-xl border-gray-200 pl-3 text-sm focus-visible:ring-indigo-500"
                  />
                )}
              </form.Field>

              {/* 描述 */}
              <form.Field
                name="projectDescription"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim()
                      ? "Description is required"
                      : value.length > DESCRIPTION_MAX
                        ? `Must be under ${DESCRIPTION_MAX} characters`
                        : undefined
                }}
              >
                {(field) => (
                  <FormTextarea
                    field={field}
                    label="Description"
                    fieldLabelStyle="text-sm font-medium text-gray-700"
                    rows={3}
                    maxLength={DESCRIPTION_MAX}
                    placeholder="What does this project do, and who is it for?"
                    className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                )}
              </form.Field>

              {/* 技术栈标签 */}
              <form.Field
                name="projectTechStack"
                validators={{
                  onChange: ({ value }) =>
                    value.length === 0 ? "Add at least one tech tag" : undefined
                }}
              >
                {(field) => (
                  <FormField
                    field={field}
                    label="Tech stack"
                    fieldLabelStyle="text-sm font-medium text-gray-700"
                  >
                    {({ isInvalid }) => (
                      <div
                        className={`flex flex-wrap items-center gap-1.5 rounded-xl border px-2.5 py-2 focus-within:ring-2 focus-within:ring-indigo-500 ${
                          isInvalid ? "border-red-200" : "border-gray-200"
                        }`}
                      >
                        {field.state.value.map((tag: string) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() =>
                                field.handleChange(
                                  field.state.value.filter(
                                    (t: string) => t !== tag
                                  )
                                )
                              }
                              className="text-gray-400 hover:text-gray-600"
                              aria-label={`Remove ${tag}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                        <input
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === ",") {
                              e.preventDefault();
                              const value = techInput.trim();
                              if (value && !field.state.value.includes(value)) {
                                field.handleChange([
                                  ...field.state.value,
                                  value
                                ]);
                              }
                              setTechInput("");
                            } else if (
                              e.key === "Backspace" &&
                              !techInput &&
                              field.state.value.length
                            ) {
                              field.handleChange(
                                field.state.value.slice(0, -1)
                              );
                            }
                          }}
                          onBlur={field.handleBlur}
                          placeholder={
                            field.state.value.length
                              ? ""
                              : "Type and press Enter, e.g. Next.js"
                          }
                          className="min-w-[140px] flex-1 border-none bg-transparent py-1 text-sm outline-none placeholder:text-gray-400"
                        />
                      </div>
                    )}
                  </FormField>
                )}
              </form.Field>

              {/* 链接 */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <form.Field
                  name="projectLiveDemoUrl"
                  validators={{
                    onChange: ({ value }) => {
                      const url = value?.trim();

                      if (!url) {
                        return undefined;
                      }

                      try {
                        new URL(url);
                        return undefined;
                      } catch {
                        return "Enter a valid demo URL";
                      }
                    }
                  }}
                >
                  {(field) => (
                    <FormInput
                      field={field}
                      label="Live demo URL"
                      fieldLabelStyle="text-sm font-medium text-gray-700"
                      placeholder="https://example.com"
                      className="h-11 rounded-xl border-gray-200 pl-3 text-sm focus-visible:ring-indigo-500"
                    />
                  )}
                </form.Field>
                <form.Field
                  name="projectRepositoryUrl"
                  validators={{
                    onChange: ({ value }) => {
                      const url = value?.trim();

                      if (!url) {
                        return undefined;
                      }

                      try {
                        new URL(url);
                        return undefined;
                      } catch {
                        return "Enter a valid repository URL";
                      }
                    }
                  }}
                >
                  {(field) => (
                    <FormInput
                      field={field}
                      label="Repository URL"
                      fieldLabelStyle="text-sm font-medium text-gray-700"
                      placeholder="https://github.com/..."
                      className="h-11 rounded-xl border-gray-200 pl-3 text-sm focus-visible:ring-indigo-500"
                    />
                  )}
                </form.Field>
              </div>

              {/* 公开状态 */}
              <form.Field name="isPublic">
                {(field) => (
                  <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3.5">
                    <Label
                      htmlFor="isPublic"
                      className="text-sm font-medium text-gray-700"
                    >
                      {field.state.value ? "Public" : "Private"}
                    </Label>
                    <Switch
                      id="isPublic"
                      checked={field.state.value}
                      onCheckedChange={(v) => field.handleChange(v)}
                    />
                  </div>
                )}
              </form.Field>
            </form>
          </div>

          {/* 右侧：实时顺序预览 */}
          <div className="space-y-6">
            <form.Subscribe selector={(state) => [state.values.projectTitle]}>
              {([title]) => (
                <OrderPositionPicker
                  mode={mode}
                  existingProjects={existingProjects}
                  currentTitle={title}
                  currentThumbnail={thumbnailPreview}
                  currentProjectId={projectId ?? null}
                  initialIndex={initialValues?.sortOrder}
                  onPositionChange={(newOrderedIds, currentIndex) => {
                    setOrderedIds(newOrderedIds);
                    setSortOrder(currentIndex);
                  }}
                />
              )}
            </form.Subscribe>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <FormButtton
                    form={formId}
                    isSubmitting={isSubmitting}
                    canSubmit={
                      canSubmit && (!!thumbnailFile || !!thumbnailPreview)
                    }
                    buttonType="submit"
                    buttonVariant="default"
                    className="h-10 flex-1 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
                    buttonContent={
                      <span className="flex items-center justify-center gap-1.5">
                        {isEdit ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        {isEdit ? "Save changes" : "Create project"}
                      </span>
                    }
                  />
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="h-10 rounded-xl px-4 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form.Subscribe>
          </div>
        </div>
      </div>
    </div>
  );
}
