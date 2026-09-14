"use client";

import { ContactMessageResponse } from "@/lib/interface/contact-message.interface";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, User } from "lucide-react";
import { useState } from "react";
import ContactMessageDetailModal from "./ContactMessageDetailModal";

interface ContactMessageSectionProps {
  messages: ContactMessageResponse[];
}

export default function ContactMessageSection({
  messages
}: ContactMessageSectionProps) {
  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessageResponse | null>(null);

  if (!messages || messages.length === 0) {
    return (
      <div className="text-muted-foreground flex h-32 flex-col items-center justify-center rounded-lg border border-dashed">
        <Mail className="text-brand-primary mb-2 h-8 w-8 stroke-1" />
        <p className="text-muted-foreground text-sm">
          No contact messages received so far.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {messages.map((msg) => {
          // 获取发件人首字母作为 Avatar 占位符
          const avatarInitials = msg.name
            ? msg.name.slice(0, 2).toUpperCase()
            : "UN";

          return (
            <div
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className="group bg-card hover:border-brand-primary/70 flex cursor-pointer items-start justify-between gap-4 rounded-xl border p-4 transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-3.5 overflow-hidden">
                <Avatar className="bg-muted h-10 w-10 shrink-0 border">
                  <AvatarFallback className="text-primary font-semibold">
                    {avatarInitials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground group-hover:text-primary truncate text-sm font-semibold">
                      {msg.name}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      &lt;{msg.email}&gt;
                    </span>
                  </div>

                  <p className="text-foreground/90 truncate text-sm font-medium">
                    {msg.subject || "Untitled"}
                  </p>

                  <p className="text-muted-foreground line-clamp-1 text-xs">
                    {msg.message}
                  </p>
                </div>
              </div>

              {/* 右侧时间戳 */}
              <div className="text-muted-foreground flex shrink-0 flex-col items-end gap-1 text-xs">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(msg.createdAt).toLocaleString("en-MY", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Kuala_Lumpur"
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 弹窗组件 */}
      <ContactMessageDetailModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />
    </>
  );
}
