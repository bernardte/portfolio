"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback
} from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Search, X, Check, Upload, Folder, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import { ICON_LIBRARY, getIconLibraryItem } from "@/lib/icons/icon-library"; // 按你项目实际路径调整这行 import
import { useToast } from "@/hook/use-toast";
import { NOTION_COLORS } from "@/constants/notionColors";

interface IconPickerPopoverProps {
  mode?: "Skill Category" | "Skill Category Item";
  value?: string; // 格式: "emoji:🚀" | "icon:FaCode" | "image:data:image/..."
  color?: string;
  iconFileUploaded?: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  isOpen: boolean;
  onClose: () => void;
  onChange: (icon: string, color?: string, fileId?: string) => void;
  onUpload: (file: File, fileCategory: string) => Promise<{ icon: string, fileId?: string }>
}

type TabType = "emoji" | "icons" | "upload";

const PADDING = 12;
const GAP = 6; // 触发元素与弹层之间的间距
const POPOVER_WIDTH = 360;

export const IconPickerPopover: React.FC<IconPickerPopoverProps> = ({
  mode,
  value = "",
  color = "none",
  triggerRef,
  isOpen,
  onClose,
  onChange,
  onUpload,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("emoji");
  const [selectedColor, setSelectedColor] = useState<string>(color);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  const popoverRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { success, error } = useToast();

  // 定位状态:ready 为 false 时先隐藏渲染用于测量真实尺寸,避免出现"跳动"的闪烁
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    placement: "top" | "bottom";
    ready: boolean;
  }>({ top: 0, left: 0, placement: "bottom", ready: false });

  // 核心定位逻辑:基于 popoverRef 的真实尺寸做四周边界检测
  const recalcPosition = useCallback(() => {
    const triggerEl = triggerRef.current;
    const popoverEl = popoverRef.current;
    if (!triggerEl || !popoverEl) return;

    const rect = triggerEl.getBoundingClientRect();
    // 用真实渲染出的高宽做计算,而不是硬编码估算值
    const popoverRect = popoverEl.getBoundingClientRect();
    const popoverHeight = popoverRect.height || 0;
    const popoverWidth = popoverRect.width || POPOVER_WIDTH;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // ---- 水平方向 ----
    let left = rect.left;
    if (left + popoverWidth > viewportWidth - PADDING) {
      left = viewportWidth - popoverWidth - PADDING;
    }
    if (left < PADDING) {
      left = PADDING;
    }

    // ---- 垂直方向 ----
    const spaceBelow = viewportHeight - rect.bottom - GAP;
    const spaceAbove = rect.top - GAP;

    let top: number;
    let placement: "top" | "bottom";

    if (spaceBelow >= popoverHeight || spaceBelow >= spaceAbove) {
      // 下方放得下,或下方空间比上方更宽裕 → 放在下方
      placement = "bottom";
      top = rect.bottom + GAP;
      // 如果下方空间其实不够(两边都不够时选空间较大的一侧),做 clamp 防止底部溢出
      const maxTop = viewportHeight - popoverHeight - PADDING;
      top = Math.min(top, Math.max(maxTop, PADDING));
    } else {
      // 下方放不下,上方空间更充足 → 翻转到触发元素上方
      placement = "top";
      top = rect.top - popoverHeight - GAP;
      top = Math.max(top, PADDING);
    }

    setPosition({ top, left, placement, ready: true });
  }, [triggerRef]);

  // 在弹层实际挂载 / 内容变化(切 tab 导致高度变化)后测量并定位。
  // useLayoutEffect 在浏览器绘制前同步执行,所以不需要额外的"先重置再计算"步骤——
  // 直接在这里算好最终位置即可,不会产生闪烁。
  useLayoutEffect(() => {
    if (!isOpen) {
      // 关闭时复位,避免下次打开时短暂复用上一次的旧坐标
      setPosition((prev) => (prev.ready ? { ...prev, ready: false } : prev));
      return;
    }
    recalcPosition();
  }, [isOpen, activeTab, recalcPosition]);

  // 监听 resize / scroll,保持弹层始终在视口内
  useEffect(() => {
    if (!isOpen) return;

    const handleReposition = () => recalcPosition();

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [isOpen, recalcPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  // 处理本地图片上传并转为 Base64（或在实际项目中在此处调用后端 API 上传）
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // 限制图片大小为 2MB
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image size must be less than 2MB");
      return;
    }

    setUploadError("");
    setIsUploading(true);

    const fileCategory =
      mode === "Skill Category" ? "skill_category_icon" : "skill_item_icon";
    try {
      const { icon, fileId } = await onUpload(file, fileCategory);
      if (fileId) {
        onChange(`image:${icon}`, selectedColor, fileId);
        success("Icon image upload successfully!");
      }
      onClose();
    } catch (errorMessage: any) {
      error(
        errorMessage instanceof Error ? errorMessage.message : errorMessage
      );
    } finally {
      setIsUploading(false);
    }
  };

  const filteredIcons = ICON_LIBRARY.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      item.label.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
    );
  });

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        width: `min(${POPOVER_WIDTH}px, calc(100vw - ${PADDING * 2}px))`,
        // 测量阶段先隐藏,避免用户看到从左上角跳到最终位置的闪烁
        visibility: position.ready ? "visible" : "hidden",
        // 最大高度兜底:即便测量存在偏差,也不会整体超出视口
        maxHeight: `calc(100vh - ${PADDING * 2}px)`
      }}
      className="animate-in fade-in zoom-in-95 z-[100] flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white text-slate-800 shadow-2xl"
    >
      {/* 顶部 Tabs & 关闭按钮 */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("emoji")}
            className={`rounded-md px-2 py-1 text-xs font-medium transition ${
              activeTab === "emoji"
                ? "bg-slate-100 text-slate-900"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Emoji
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("icons")}
            className={`rounded-md px-2 py-1 text-xs font-medium transition ${
              activeTab === "icons"
                ? "bg-slate-100 text-slate-900"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Icons
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`rounded-md px-2 py-1 text-xs font-medium transition ${
              activeTab === "upload"
                ? "bg-slate-100 text-slate-900"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Custom
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Notion 背景底色选择盘 */}
      <div className="shrink-0 border-b border-slate-100 bg-slate-50/50 px-3 py-2">
        <span className="mb-1.5 block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          Background Accent
        </span>
        <div className="flex scrollbar-none items-center gap-1.5 overflow-x-auto p-1.5">
          {NOTION_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              title={c.id === "none" ? "No accent" : c.id}
              onClick={() => {
                setSelectedColor(c.id);
                onChange(value, c.id);
              }}
              className={`relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full border transition ${c.bg} ${c.border} ${
                selectedColor === c.id
                  ? "ring-2 ring-slate-400 ring-offset-1"
                  : ""
              }`}
            >
              {/* "none" 用棋盘格 + 对角线表示透明,和 Notion / Figma 的透明色块一致 */}
              {c.id === "none" && (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%), linear-gradient(45deg, #e2e8f0 25%, transparent 25%, transparent 75%, #e2e8f0 75%)",
                    backgroundSize: "6px 6px",
                    backgroundPosition: "0 0, 3px 3px"
                  }}
                />
              )}
              {c.id === "none" && (
                <span className="absolute inset-0 rounded-full bg-[linear-gradient(to_bottom_right,transparent_calc(50%-0.75px),#ef4444_50%,transparent_calc(50%+0.75px))]" />
              )}

              {selectedColor === c.id && (
                <Check
                  className={`relative z-10 h-2.5 w-2.5 stroke-[3] ${
                    c.id === "none" ? "text-slate-600" : ""
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 选择内容 */}
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {activeTab === "emoji" && (
          <div className="h-[320px] overflow-hidden">
            <EmojiPicker
              onEmojiClick={(e: EmojiClickData) => {
                onChange(`emoji:${e.emoji}`, selectedColor);
                onClose();
              }}
              width="100%"
              height="320px"
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}

        {activeTab === "icons" && (
          <div className="space-y-2 p-1">
            <div className="relative">
              <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search icon... (e.g. docker, react, cloud)"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-2.5 pl-8 text-xs focus:bg-white focus:outline-none"
              />
            </div>

            {filteredIcons.length > 0 ? (
              <div className="grid max-h-[220px] grid-cols-6 gap-1.5 overflow-y-auto">
                {filteredIcons.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    title={label}
                    onClick={() => {
                      onChange(`icon:${id}`, selectedColor);
                      onClose();
                    }}
                    className={`flex items-center justify-center rounded-lg p-2 transition hover:bg-slate-100 ${
                      value === `icon:${id}` ? "bg-slate-200" : ""
                    }`}
                  >
                    <Icon className="h-4 w-4 text-slate-700" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex h-[120px] items-center justify-center text-xs text-slate-400">
                No icons match "{searchQuery}"
              </div>
            )}
          </div>
        )}

        {activeTab === "upload" && (
          <div className="flex flex-col items-center justify-center p-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={handleImageUpload}
            />

            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-6 transition ${
                isUploading
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 opacity-60"
                  : "border-slate-300 bg-slate-50 hover:border-indigo-500 hover:bg-indigo-50/30"
              }`}
            >
              <div className="rounded-full bg-white p-2.5 shadow-sm">
                {isUploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                ) : (
                  <Upload className="h-5 w-5 text-indigo-600" />
                )}
              </div>

              <div className="text-center">
                <span className="block text-xs font-semibold text-slate-700">
                  {isUploading ? "Uploading..." : "Click to upload image"}
                </span>

                <span className="block text-[10px] text-slate-400">
                  {isUploading ? "Please wait..." : "PNG, JPG or SVG (Max 2MB)"}
                </span>
              </div>
            </button>
            {uploadError && (
              <span className="mt-2 text-center text-xs text-red-500">
                {uploadError}
              </span>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

// 兼容支持自定义图片的 Icon 渲染组件
export const NotionIconDisplay: React.FC<{
  icon?: string;
  color?: string;
  className?: string;
  size?: "sm" | "lg";
  variant?: "boxed" | "bare"; // boxed(默认) = 自带背景盒子; bare = 只渲染图标本身,交给外层容器控制样式
}> = ({ icon, color = "none", className, size = "sm", variant = "boxed" }) => {
  const colorObj =
    NOTION_COLORS.find((c) => c.id === color) || NOTION_COLORS[0];

  const iconSize = size === "lg" ? "h-6 w-6" : "w-5 h-5";
  const containerSize =
    size === "lg" ? "size-12 rounded-xl p-3 sm:size-14" : "rounded-lg p-2";

  const finalIconClassName = className ?? iconSize;

  const renderInner = () => {
    if (!icon) return <Folder className={finalIconClassName} />;

    if (icon.startsWith("emoji:")) {
      return (
        <span
          className={
            size === "lg" ? "text-2xl leading-none" : "text-base leading-none"
          }
        >
          {icon.replace("emoji:", "")}
        </span>
      );
    }

    if (icon.startsWith("icon:")) {
      const found = getIconLibraryItem(icon.replace("icon:", ""));
      if (found) {
        const Icon = found.Icon;
        return <Icon className={finalIconClassName} />;
      }
    }

    if (icon.startsWith("image:")) {
      const imageUrl = icon.replace("image:", "");
      return (
        <img
          src={imageUrl}
          alt="Custom Icon"
          className={`${finalIconClassName} rounded-md object-cover`}
        />
      );
    }

    return <Folder className={finalIconClassName} />;
  };

  if (variant === "bare") {
    return <>{renderInner()}</>;
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center border transition-colors ${containerSize} ${colorObj.bg} ${colorObj.border}`}
    >
      {renderInner()}
    </div>
  );
};
