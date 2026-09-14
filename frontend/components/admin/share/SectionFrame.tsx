import { cn } from "@/lib/utils";

interface SectionFrameProps {
  children: React.ReactNode;
  className?: string;
}

interface SectionSubComponentProps {
  children: React.ReactNode;
  className?: string;
}

function SectionFrame({ children, className }: SectionFrameProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

function SectionFrameHeader({ children, className }: SectionSubComponentProps) {
  return (
    <div className={cn("flex items-center justify-between pb-4", className)}>
      {children}
    </div>
  );
}

function SectionFrameTitle({ children, className }: SectionSubComponentProps) {
  return (
    <p className={cn("text-sm font-semibold text-black/70", className)}>
      {children}
    </p>
  );
}

function SectionFrameBody({ children, className }: SectionSubComponentProps) {
  return <div className={cn("py-2", className)}>{children}</div>;
}

function SectionFrameFooter({ children, className }: SectionSubComponentProps) {
  return (
    <div
      className={cn(
        "mt-4 flex justify-end border-t border-slate-100 pt-4",
        className
      )}
    >
      {children}
    </div>
  );
}

// 挂载到主组件
SectionFrame.Header = SectionFrameHeader;
SectionFrame.Title = SectionFrameTitle;
SectionFrame.Body = SectionFrameBody;
SectionFrame.Footer = SectionFrameFooter;

export default SectionFrame;
