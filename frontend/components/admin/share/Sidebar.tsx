"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, Code, LogOut, X, type LucideIcon } from "lucide-react";
import {
  SIDEBAR_ITEM_LINK,
  type SidebarItem as SidebarItemType
} from "@/constants/adminSidebarNavLink";
import { logout } from "@/lib/api/auth";
import { useToast } from "@/hook/use-toast";

type CurrentUser = {
  name: string;
  email: string;
  avatar: string | null;
};

interface SidebarProps {
  user: CurrentUser;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  user,
  mobileOpen,
  setMobileOpen
}: SidebarProps) {
  const pathname = usePathname();

  // 路由切换时自动收起移动端 Drawer
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  // Drawer 打开时锁定背景 Body 滚动
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* 移动端遮罩层 */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* 移动端 Drawer 抽屉 */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`bg-brand-bg fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] transform transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="close menu"
            className="absolute top-3.5 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="size-4" />
          </button>
          <SidebarBody user={user} pathname={pathname} />
        </div>
      </aside>

      {/* 桌面端静态侧边栏 */}
      <aside className="border-brand-bg relative hidden w-50 shrink-0 border-r lg:block">
        <SidebarBody user={user} pathname={pathname} />
      </aside>
    </>
  );
}

function SidebarBody({
  user,
  pathname
}: {
  user: CurrentUser;
  pathname: string;
}) {
  return (
    <div className="bg-brand-bg flex h-full flex-col">
      {/* Logo 区域 */}
      <div className="relative flex shrink-0 items-center gap-2.5 border-b border-slate-800/60 px-4 py-3.5">
        <div className="bg-brand-primary shadow-brand-primary/30 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-md transition-all duration-200 hover:bg-blue-800 hover:shadow-blue-500/40 active:scale-95">
          <Code className="size-4 text-white" />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-between">
          <span className="font-semibold text-stone-100">Portfolio</span>
          <span className="bg-brand-accent h-2 w-2 shrink-0 rounded-full" />
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {SIDEBAR_ITEM_LINK.map((item) => (
          <SidebarItem key={item.label} item={item} pathname={pathname} />
        ))}
      </nav>

      {/* Footer: User + Logout */}
      <SidebarFooter user={user} />
    </div>
  );
}

function SidebarItem({
  item,
  pathname
}: {
  item: SidebarItemType;
  pathname: string;
}) {
  const hasChildren = !!item.children?.length;
  const isActive = !hasChildren && pathname === item.href;
  const isChildActive =
    hasChildren && item.children?.some((c) => pathname === c.href);

  const [open, setOpen] = useState(!!isChildActive);
  const Icon = item.icon as LucideIcon;

  const itemClass = (active: boolean) =>
    `relative flex w-full items-center justify-start gap-2.5 rounded-lg border-none px-3 py-2 text-sm font-medium transition-colors duration-150 ${
      active
        ? "bg-brand-primary text-white shadow-sm"
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`;

  if (!hasChildren) {
    return (
      <Button
        variant="ghost"
        aria-current={isActive ? "page" : undefined}
        className={itemClass(isActive)}
      >
        <Link
          href={item.href ?? "#"}
          className="flex w-full items-center gap-2.5"
        >
          <Icon className="size-4" />
          <span>{item.label}</span>
        </Link>
      </Button>
    );
  }

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={itemClass(!!isChildActive && !open)}
      >
        <Icon className="size-4" />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </Button>

      <div
        className={`grid overflow-hidden transition-all duration-200 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <div className="mt-1 ml-4 space-y-1 border-l border-slate-800/60 pl-3">
            {item.children?.map((child) => {
              const childActive = pathname === child.href;
              return (
                <Button
                  key={child.label}
                  variant="ghost"
                  aria-current={childActive ? "page" : undefined}
                  className={`relative flex w-full items-center justify-start gap-2.5 rounded-lg border-none px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                    childActive
                      ? "bg-brand-primary text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Link
                    href={child.href ?? "#"}
                    className="flex w-full items-center gap-2"
                  >
                    <span className="size-1.5 shrink-0 rounded-full bg-current" />
                    <span>{child.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarFooter({ user }: { user: CurrentUser }) {
  const { success } = useToast();
  const router = useRouter();

  async function handleLogout() {
    await logout().then(() => {
       success("Logout successfully");
       router.push("/admin/auth?mode=login")
    });
  }

  return (
    <div className="shrink-0 border-t border-slate-800/60 px-3 py-3">
      <button
        type="button"
        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors duration-150 hover:bg-white/5"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="bg-brand-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{user.name}</p>
          <p className="truncate text-xs text-slate-400">{user.email}</p>
        </div>
      </button>

      <Button
        onClick={handleLogout}
        variant="ghost"
        className="mt-1 flex w-full items-center justify-start gap-2.5 rounded-lg border-none px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-400"
      >
        <LogOut className="size-4" />
        Logout
      </Button>
    </div>
  );
}
