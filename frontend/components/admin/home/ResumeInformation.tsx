"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadFile, previewFile, downloadFile } from "@/lib/api/file";
import { formatDate } from "@/lib/utils/formatDate";
import {
  FileText,
  Eye,
  Download,
  UploadCloud,
  CheckCircle2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useRef, useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

function formatFileSize(bytes: number | null) {
  if (bytes === null || bytes === undefined) {
    return "-";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatUpdatedAt(date: string | null) {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export default function ResumeInformation({
  profileId,
  initialHasResume,
  initialFileName,
  initialFileSize,
  initialUpdatedAt
}: {
  profileId: string;
  initialHasResume: boolean;
  initialFileName: string | null;
  initialFileSize: number | null;
  initialUpdatedAt: Date | null;
}) {
  const [uploaded, setUploaded] = useState(initialHasResume);
  const [fileName, setFileName] = useState(initialFileName);
  const [fileSize, setFileSize] = useState(initialFileSize);
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt);

  const [isUploading, setIsUploading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePickFile() {
    setResumeError(null);
    fileInputRef.current?.click();
  }

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    // 允许用户再次选择同一个文件
    e.target.value = "";

    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setResumeError("Only PDF or DOCX files are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setResumeError("File must be under 10MB");
      return;
    }

    if (!profileId) {
      setResumeError("Please save your profile details first");
      return;
    }

    setResumeError(null);
    setIsUploading(true);

    try {
      const result = await uploadFile(profileId, "resume", file);

      setUploaded(true);

      // Backend return 的资料
      setFileName(result.data.resumeOriginalName ?? file.name);
      setFileSize(result.data.resumeFileSize ?? file.size);
      setUpdatedAt(
        result.data.resumeUpdatedAt
          ? new Date(result.data.resumeUpdatedAt)
          : new Date()
      );
    } catch (error) {
      console.error("Resume upload failed:", error);

      setResumeError(
        error instanceof Error
          ? error.message
          : "Upload failed, please try again"
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handlePreview() {
    setResumeError(null);
    setPreviewLoading(true);

    try {
      await previewFile(profileId, "resume");
    } catch (error) {
      console.error("Preview failed:", error);
      setResumeError("Unable to open preview, please try again");
    } finally {
      setPreviewLoading(false);
    }
  }

  async function handleDownload() {
    setResumeError(null);
    setDownloadLoading(true);

    try {
      await downloadFile(profileId, "resume");
    } catch (error) {
      console.error("Download failed:", error);
      setResumeError("Unable to download, please try again");
    } finally {
      setDownloadLoading(false);
    }
  }

  const hiddenInput = (
    <Input
      ref={fileInputRef}
      type="file"
      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      className="hidden"
      onChange={handleResumeUpload}
    />
  );

  return (
    <div className="flex min-h-[140px] w-full flex-col justify-between">
      {!uploaded ? (
        /* 空状态 */
        <div
          onClick={isUploading ? undefined : handlePickFile}
          className={`border-brand-accent/30 hover:border-brand-accent bg-brand-accent/5 hover:bg-brand-accent/10 group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all ${
            isUploading ? "cursor-wait opacity-70" : "cursor-pointer"
          }`}
        >
          <div className="bg-brand-accent/10 text-brand-accent flex h-10 w-10 items-center justify-center rounded-full transition-transform group-hover:scale-110">
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <UploadCloud className="h-5 w-5" />
            )}
          </div>

          <div className="mt-2 text-center">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {isUploading ? "Uploading…" : "Upload your resume"}
            </p>

            {hiddenInput}

            <p className="text-[11px] text-slate-400">PDF, DOCX up to 10 MB</p>

            {resumeError && (
              <p className="mt-1.5 flex items-center justify-center gap-1 text-[11px] font-medium text-red-500">
                <AlertCircle className="h-3 w-3" />
                {resumeError}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* 已上传状态 */
        <div className="border-brand-card/5 bg-brand-accent/5 @container flex w-full flex-1 flex-col rounded-md p-4 shadow-sm sm:p-5">
          <div className="flex flex-1 flex-wrap items-start justify-between gap-x-3 gap-y-2 overflow-hidden">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <div className="bg-brand-accent/10 text-brand-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <FileText className="h-5 w-5" />
              </div>

              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {fileName}
                </span>

                {/* File size + Updated At */}
                <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-slate-400">
                  <span>{formatFileSize(fileSize)}</span>

                  <span>•</span>

                  <span>Updated {formatDate(updatedAt)}</span>
                </div>
              </div>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Uploaded
            </span>
          </div>

          <div className="my-4 flex shrink-0 flex-col gap-2 @sm:flex-row @sm:items-center">
            <Button
              variant="outline"
              size="sm"
              disabled={previewLoading}
              onClick={handlePreview}
              className="border-brand-accent/40 text-brand-accent hover:bg-brand-accent/10 hover:text-brand-primary hover:border-brand-accent focus-visible:ring-brand-accent/50 h-11 w-full min-w-0 gap-1.5 px-2 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-offset-1 @sm:h-9 @sm:flex-1"
            >
              {previewLoading ? (
                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
              ) : (
                <Eye className="h-3.5 w-3.5 shrink-0" />
              )}

              <span className="truncate">
                {previewLoading ? "Opening…" : "View"}
              </span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={downloadLoading}
              onClick={handleDownload}
              className="border-brand-accent/40 text-brand-accent hover:bg-brand-accent/10 hover:text-brand-primary hover:border-brand-accent focus-visible:ring-brand-accent/50 h-11 w-full min-w-0 gap-1.5 px-2 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-offset-1 @sm:h-9 @sm:flex-1"
            >
              {downloadLoading ? (
                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5 shrink-0" />
              )}

              <span className="truncate">
                {downloadLoading ? "Downloading…" : "Download"}
              </span>
            </Button>

            <Button
              size="sm"
              disabled={isUploading}
              onClick={handlePickFile}
              className="bg-brand-accent hover:bg-brand-accent/90 focus-visible:ring-brand-accent/50 h-11 w-full min-w-0 gap-1.5 px-2 text-xs font-medium text-white shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-60 @sm:h-9 @sm:flex-1"
            >
              {isUploading ? (
                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
              ) : (
                <UploadCloud className="h-3.5 w-3.5 shrink-0" />
              )}

              <span className="truncate">
                {isUploading ? "Uploading…" : "Replace"}
              </span>
            </Button>

            {hiddenInput}
          </div>

          <p className="shrink-0 text-center text-[11px] text-slate-400">
            Supported formats: PDF, DOCX up to 10 MB
          </p>

          {resumeError && (
            <p className="mt-1 flex items-center justify-center gap-1 text-[11px] font-medium text-red-500">
              <AlertCircle className="h-3 w-3" />
              {resumeError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
