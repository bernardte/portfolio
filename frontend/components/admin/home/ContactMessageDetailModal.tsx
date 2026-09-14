import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContactMessageResponse } from "@/lib/interface/contact-message.interface";
import {
  Mail,
  Calendar,
  User,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

interface ContactMessageDetailModalProps {
  message: ContactMessageResponse | null;
  onClose: () => void;
}

export default function ContactMessageDetailModal({
  message,
  onClose
}: ContactMessageDetailModalProps) {
  if (!message) return null;

  const formattedDate = new Date(message.createdAt).toLocaleString("en-MY", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kuala_Lumpur"
  });

  return (
    <Dialog open={!!message} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[calc(100%-4rem)] sm:max-w-xl lg:max-w-2xl">
        <DialogHeader className="space-y-1 border-b pb-4">
          <DialogTitle className="text-xl font-bold">
            {message.subject || "Uncategorized Message"}
          </DialogTitle>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            <span>Sent:{formattedDate}</span>
          </div>
        </DialogHeader>

        {/* 发件人元数据 */}
        <div className="bg-muted/40 grid grid-cols-2 gap-4 rounded-lg p-3.5 text-sm">
          <div className="flex items-center gap-2">
            <User className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground font-medium">Sender:</span>
            <span className="text-foreground font-semibold">
              {message.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground font-medium">Email:</span>
            <a
              href={`mailto:${message.email}`}
              className="text-primary truncate hover:underline"
            >
              {message.email}
            </a>
          </div>
        </div>

        {/* 消息正文 */}
        <div className="space-y-2 py-2">
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Message Body</span>
          </div>
          <div className="bg-card max-h-[300px] overflow-y-auto rounded-md border p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {message.message}
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Link
            href={`mailto:${message.email}?subject=Re:${encodeURIComponent(message.subject)}`}
          >
            <Button className="flex w-full items-center gap-1.5">
              <ExternalLink className="h-4 w-4" />
              Reply to email
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
