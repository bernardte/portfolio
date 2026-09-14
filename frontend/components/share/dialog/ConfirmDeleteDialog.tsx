"use client";

import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description: React.ReactNode;

  confirmText?: string;
  cancelText?: string;

  loading?: boolean;
  loadingText?: string;

  onConfirm: () => void | Promise<void>;

  destructive?: boolean;
}

export const ConfirmAlertDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  loadingText = "Processing...",
  onConfirm,
  destructive = false,
}: ConfirmAlertDialogProps) => {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        // Loading 时不允许关闭 Dialog
        if (!loading) {
          onOpenChange(value);
        }
      }}
    >
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            className="rounded-lg"
          >
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className={
              destructive
                ? "rounded-lg bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
                : "rounded-lg"
            }
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {loading ? loadingText : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

