import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";

interface InfoItemProps {
  Icon: LucideIcon | IconType;
  label: string;
  value: string;
}

export function InfoItem({ Icon, label, value }: InfoItemProps) {
  return (
    <div className="border-muted-foreground/30 flex h-full items-center gap-3 rounded-2xl border-2 px-2 py-3">
      <Icon className="text-brand-primary size-5 shrink-0" />

      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-xs text-neutral-400">{label}</span>
        <span className="text-xs font-semibold text-white/70">{value}</span>
      </div>
    </div>
  );
}
