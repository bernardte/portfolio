import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AdminNavbarProps {
  onToggleSidebar?: () => void;
  slug: string;
}

export default function AdminNavbar({
  onToggleSidebar,
  slug
}: AdminNavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      {/* 左侧：移动端 Sidebar 切换按钮 + 页面标题区 */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* 仅在移动端显示汉堡包菜单按钮 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-brand-accent hover:bg-brand-accent/20 lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* 标题与副标题 */}
        <div className="flex flex-col">
          <h1 className="text-base font-bold text-slate-900 sm:text-lg">
            Profile Overview
          </h1>
          <p className="hidden text-xs text-slate-500 sm:block">
            Manage your portfolio and showcase your best work
          </p>
        </div>
      </div>

      {/* 右侧：操作区域 (Preview Button, Theme Toggle, Notification) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Preview Portfolio 按钮 (匹配截图中的浅紫框样式) */}
        <Link
          href={`/${slug}`}
          target="_blank"
          rel={"noopener noreferrer"}
          aria-label={`/${slug}`}
        >
          <Button
            variant="outline"
            size="sm"
            className="border-brand-primary bg-brand-primary/10 h-9 gap-1.5 px-3 font-medium text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 sm:px-4"
          >
            <span className="hidden sm:inline">Preview Portfolio</span>
            <span className="inline sm:hidden">Preview</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
