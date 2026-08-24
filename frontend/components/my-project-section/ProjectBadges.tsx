import { cn } from "@/lib/utils";

export default function ProjectBadges({
  title,
  className
}: {
  title: string;
  className: string;
}) {
  return (
    <div className={cn(className, "rounded-md px-2 py-2")}>
      <span>{title}</span>
    </div>
  );
}
