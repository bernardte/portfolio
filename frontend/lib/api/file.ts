// lib/api/file.ts
import { apiClient } from "./client";

export type FileCategory = "avatar" | "resume";
export type FileMode = "preview" | "download";

export interface FileUrlResponse {
  url: string;
  fileName: string;
  mimeType: string;
}

export interface UploadResponse {
  message: string;
  data: {
    resumeOriginalName?: string;
    resumeFileSize?: number | null;
    resumeUpdatedAt?: Date | null;
    avatarUrl?: string;
    avatarOriginalName?: string;
  };
}

const FIELD_NAME: Record<FileCategory, string> = {
  avatar: "avatarFile",
  resume: "resumeFile"
};

export function uploadFile(
  profileId: string,
  category: FileCategory,
  file: File
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append(FIELD_NAME[category], file);

  return apiClient<UploadResponse>(`/profile/${profileId}/${category}`, {
    method: "PATCH",
    body: formData
  });
}

export async function getFileUrl(
  profileId: string,
  category: FileCategory,
  mode: FileMode = "preview"
): Promise<FileUrlResponse> {
  return apiClient<FileUrlResponse>(
    `/profile/${profileId}/${category}/url?mode=${mode}`,
    { method: "GET" }
  );
}

export function removeFile(
  profileId: string,
  category: FileCategory
): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/profile/${profileId}/${category}`, {
    method: "DELETE"
  });
}

export async function previewFile(profileId: string, category: FileCategory) {
  const { url } = await getFileUrl(profileId, category, "preview");
  window.open(url, "_blank", "noopener,noreferrer");
}

export async function downloadFile(profileId: string, category: FileCategory) {
  const { url, fileName } = await getFileUrl(profileId, category, "download");
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
