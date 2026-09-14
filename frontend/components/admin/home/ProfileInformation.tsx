"use client";

import FormButtton from "@/components/share/form/form-controls/FormButtton";
import FormInput from "@/components/share/form/form-controls/FormInput";
import FormTextarea from "@/components/share/form/form-controls/FormTextarea";
import FormField from "@/components/share/form/FormField";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hook/use-toast";
import {
  createProfileDetail,
  updateProfileDetail
} from "@/lib/api/profile-information";
import { uploadFile } from "@/lib/api/file";
import { ProfileInformationResponse } from "@/lib/interface/profile.interface";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form-nextjs";
import { Camera, GraduationCap, MapPin, Save, User, User2 } from "lucide-react";
import Image from "next/image";
import { SetStateAction, useRef, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import slugify from "slugify";
import { Input } from "@/components/ui/input";
import { Check, Copy } from "lucide-react";
import { AvatarImage } from "@/components/ui/avatar";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

export default function ProfileInformation({
  initialProfileData
}: {
  initialProfileData: ProfileInformationResponse;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [profile, setProfile] = useState<ProfileInformationResponse | null>(
    initialProfileData
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialProfileData.avatarUrl
  );
  const [isCopied, setIsCopied] = useState(false);

  const { error, success } = useToast();

  const handleCopyUrl = async (slug: string) => {
    if (!slug.trim()) return;

    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL?.replace(/\/$/, "");

    const url = `${baseUrl}/${slug}`;

    try {
      await navigator.clipboard.writeText(url);

      setIsCopied(true);
      success("Url Coppied!");

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      error("Failed to copy portfolio URL");
    }
  };
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setAvatarError("Only JPG or PNG files are allowed");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setAvatarError("File must be under 5MB");
      return;
    }

    if (!profile?.id) {
      setAvatarError("Please save your profile details first");
      return;
    }

    setAvatarError(null);
    setIsAvatarUploading(true);

    try {
      const response = await uploadFile(profile.id, "avatar", file);

      if (response.data.avatarUrl) {
        setAvatarPreview(response.data.avatarUrl);
      }
    } catch (err) {
      setAvatarError(
        err instanceof Error ? err.message : "Failed to upload avatar"
      );
    } finally {
      setIsAvatarUploading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-stretch">
      {/* LEFT CONTENT - AVATAR */}
      <div className="flex shrink-0 flex-col items-center gap-2 sm:items-start">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={handleAvatarChange}
        />

        <div className="relative">
          <button
            type="button"
            onClick={isAvatarUploading ? undefined : handleAvatarClick}
            disabled={isAvatarUploading}
            className="group relative h-24 w-24 disabled:cursor-wait disabled:opacity-70"
          >
            <div className="border-brand-bg/20 relative h-24 w-24 overflow-hidden rounded-full border">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar"
                  fill
                  sizes="96px"
                  priority
                  className="object-cover transition-opacity group-hover:opacity-80"
                />
              ) : (
                <div
                  role="img"
                  aria-label="Default avatar"
                  className="bg-brand-accent/10 text-muted-foreground flex h-full w-full items-center justify-center"
                >
                  <User2 className="size-10 opacity-60" />
                </div>
              )}
            </div>
            <span className="bg-brand-primary absolute right-0 bottom-2 z-10 flex h-7 w-7 items-center justify-center rounded-full text-white">
              <Camera size={14} />
            </span>
          </button>
        </div>

        <p className="text-xs text-neutral-500">JPG, PNG up to 5MB</p>
        {avatarError && <p className="text-xs text-red-500">{avatarError}</p>}

        <Button
          variant="outline"
          type="button"
          onClick={handleAvatarClick}
          disabled={isAvatarUploading}
          size="sm"
          className="border-brand-primary bg-brand-primary/10 h-9 gap-1.5 px-3 font-medium text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 sm:px-4"
        >
          {isAvatarUploading ? "Uploading…" : "Change Avatar"}
        </Button>
      </div>

      {/* RIGHT CONTENT - PERSONAL DETAIL FORM */}
      <PersonalDetailForm
        profile={profile}
        setProfile={setProfile}
        handleCopyUrl={handleCopyUrl}
        isCopied={isCopied}
      />
    </div>
  );
}

function PersonalDetailForm({
  profile,
  setProfile,
  handleCopyUrl,
  isCopied
}: {
  profile: ProfileInformationResponse | null;
  setProfile: React.Dispatch<SetStateAction<ProfileInformationResponse | null>>;
  handleCopyUrl: (slug: string) => void;
  isCopied: boolean;
}) {
  const { success, error } = useToast();

  const form = useForm({
    defaultValues: {
      education: profile?.highestEducationLevel ?? "",
      location: profile?.location ?? "",
      linkedinLink: profile?.linkedinLink ?? "",
      githubLink: profile?.githubLink ?? "",
      bio: profile?.bio ?? "",
      slug:
        profile?.slug ??
        slugify(profile?.user?.name ?? "", {
          lower: true,
          strict: true
        })
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = {
          highestEducationLevel: value.education,
          location: value.location,
          linkedinLink: value.linkedinLink,
          githubLink: value.githubLink,
          bio: value.bio,
          slug: value.slug
        };

        let data;

        if (profile?.id) {
          data = await updateProfileDetail(profile.id, payload);
        } else {
          data = await createProfileDetail(payload);
        }

        if (data) {
          setProfile(data as ProfileInformationResponse);
          success(
            profile?.id
              ? "Personal Detail Updated!"
              : "Personal Detail Created!"
          );
        }
      } catch (errorMessage: unknown) {
        error(
          errorMessage instanceof Error
            ? errorMessage.message
            : "An error occurred"
        );
      }
    }
  });

  const inputClassName =
    "w-full bg-gray-50 text-sm border border-gray-200 focus-visible:ring-brand-primary pl-8 focus-visible:border-brand-primary rounded-md py-5 text-gray-900 placeholder:text-gray-400 transition-colors";

  const errorInputClassName =
    "border-red-400 focus-visible:ring-red-400 focus-visible:border-red-400";

  return (
    <form
      id="profile-form"
      noValidate
      /* 核心修改 1：把 form 改为 flex 垂直布局，高度撑满 */
      className="flex flex-1 flex-col justify-between"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field
          name="slug"
          validators={{
            onBlur: ({ value }) => {
              const slug = value.trim();

              if (!slug) {
                return "Please enter your portfolio URL";
              }

              if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
                return "Only lowercase letters, numbers, and hyphens are allowed";
              }

              return undefined;
            }
          }}
        >
          {(field) => (
            <div className="sm:col-span-2">
              <FormField
                field={field}
                label="Portfolio URL"
                fieldLabelStyle="text-gray-700"
              >
                {({ id, name, value, isInvalid, onBlur, onChange }) => (
                  <div className="w-full">
                    <div
                      className={cn(
                        "flex w-full overflow-hidden rounded-md border bg-gray-50 transition-colors",
                        isInvalid
                          ? "border-red-400"
                          : "focus-within:border-brand-primary border-gray-200"
                      )}
                    >
                      {/* Fixed URL prefix */}
                      <div className="flex shrink-0 items-center border-r border-gray-200 bg-gray-100 px-3 text-sm text-gray-500">
                        {process.env.NEXT_PUBLIC_FRONTEND_URL}/
                      </div>

                      {/* Editable slug */}
                      <Input
                        id={id}
                        name={name}
                        value={value}
                        placeholder="tee-yu-hang"
                        aria-invalid={isInvalid}
                        onBlur={onBlur}
                        onChange={(e) => onChange(e.target.value)}
                        className="min-w-0 flex-1 rounded-none border-0 bg-transparent py-5 text-sm text-gray-900 shadow-none focus-visible:ring-0"
                      />

                      {/* Copy URL */}
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(value)}
                        disabled={!value.trim()}
                        aria-label="Copy portfolio URL"
                        title={isCopied ? "Copied!" : "Copy portfolio URL"}
                        className={cn(
                          "flex shrink-0 items-center justify-center border-l border-gray-200 px-3 transition-colors",
                          "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                          "disabled:cursor-not-allowed disabled:opacity-40"
                        )}
                      >
                        {isCopied ? (
                          <Check className="size-4 text-green-600" />
                        ) : (
                          <Copy className="size-4" />
                        )}
                      </button>
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      This will be your public portfolio URL.
                    </p>
                  </div>
                )}
              </FormField>
            </div>
          )}
        </form.Field>

        <form.Field
          name="education"
          validators={{
            onBlur: ({ value }) =>
              value.trim().length === 0
                ? "Please select your highest education level"
                : undefined
          }}
        >
          {(field) => (
            <div>
              <FormInput
                field={field}
                label="Highest Education Level"
                fieldLabelStyle="text-gray-700"
                placeholder="Highest Education Level"
                icon={<GraduationCap size={20} className="text-blue-400" />}
                className={cn(
                  inputClassName,
                  field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 &&
                    errorInputClassName
                )}
              />
            </div>
          )}
        </form.Field>

        <form.Field
          name="location"
          validators={{
            onBlur: ({ value }) =>
              value.trim().length === 0
                ? "Please enter your location"
                : undefined
          }}
        >
          {(field) => (
            <div>
              <FormInput
                field={field}
                label="Location"
                fieldLabelStyle="text-gray-700"
                placeholder="Penang, Malaysia"
                icon={<MapPin size={20} className="text-rose-400" />}
                className={cn(
                  inputClassName,
                  field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 &&
                    errorInputClassName
                )}
                autoComplete="address-level2"
              />
            </div>
          )}
        </form.Field>

        <form.Field
          name="linkedinLink"
          validators={{
            onBlur: ({ value }) =>
              value && !/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(value)
                ? "Please enter a valid LinkedIn URL"
                : undefined
          }}
        >
          {(field) => (
            <div>
              <FormInput
                field={field}
                label="LinkedIn Link"
                fieldLabelStyle="text-gray-700"
                placeholder="linkedin.com/in/username"
                icon={<FaLinkedin size={20} className="text-blue-500" />}
                className={cn(
                  inputClassName,
                  field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 &&
                    errorInputClassName
                )}
              />
            </div>
          )}
        </form.Field>

        <form.Field
          name="githubLink"
          validators={{
            onBlur: ({ value }) =>
              value && !/^https?:\/\/(www\.)?github\.com\/.+/.test(value)
                ? "Please enter a valid GitHub URL"
                : undefined
          }}
        >
          {(field) => (
            <div>
              <FormInput
                field={field}
                label="GitHub Link"
                fieldLabelStyle="text-gray-700"
                placeholder="github.com/username"
                icon={<FaGithub size={20} className="text-gray-600" />}
                className={cn(
                  inputClassName,
                  field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 &&
                    errorInputClassName
                )}
              />
            </div>
          )}
        </form.Field>

        <div className="flex flex-col sm:col-span-2">
          <form.Field
            name="bio"
            validators={{
              onBlur: ({ value }) =>
                value.trim().length === 0
                  ? "Please write a short bio"
                  : value.length > 500
                    ? "Bio must be under 500 characters"
                    : undefined
            }}
          >
            {(field) => (
              <div className="flex flex-1 flex-col">
                <FormTextarea
                  field={field}
                  label="Bio"
                  fieldLabelStyle="text-gray-700"
                  placeholder="Tell us a bit about yourself..."
                  rows={4}
                  className={cn(
                    inputClassName,
                    "max-h-[150px] resize-none overflow-y-auto",
                    field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 &&
                      errorInputClassName
                  )}
                />
              </div>
            )}
          </form.Field>
        </div>
      </div>

      {/* 核心修改 2：把 mt-6 改为 pt-4，紧贴表单底部 */}
      <div className="flex justify-end pt-4">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <FormButtton
              form="profile-form"
              isSubmitting={isSubmitting}
              canSubmit={canSubmit}
              buttonType="submit"
              buttonVariant="default"
              buttonContent={
                <>
                  <span>Save Changes</span>
                  <Save className="mr-1 size-4" />
                </>
              }
            />
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
