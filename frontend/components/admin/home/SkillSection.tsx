"use client";

import { SkillCategoryResponse } from "@/lib/interface/skill.interface";
import { NotionIconDisplay } from "../../share/icon-picker/IconPickerPopover";

export default function SkillSection({
  sortedCategories
}: {
  sortedCategories: SkillCategoryResponse[];
}) {
  return (
    <div>
      {sortedCategories.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          No categories yet — add one to start grouping skills.
        </p>
      ) : (
        /* 改为最高 2 列，防止卡片被挤扁 */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sortedCategories.map((category) => {
            const accent = category.color || "#6366f1";

            return (
              <div
                key={category.id}
                className="relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all hover:border-slate-300 hover:bg-white hover:shadow-xs"
              >
                <div>
                  {/* 头部标题区：放大图标和字号 */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/60 bg-white shadow-xs">
                        {category.icon ? (
                          <NotionIconDisplay
                            color={category.color ?? "indigo"}
                            icon={category.icon}
                            className="h-6 w-6"
                          />
                        ) : (
                          <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                        )}
                      </div>
                      <span className="truncate text-base font-semibold text-slate-800">
                        {category.title}
                      </span>
                    </div>

                    {/* 数量 Badge */}
                    <span className="flex h-6 min-w-[24px] shrink-0 items-center justify-center rounded-full bg-indigo-600 px-2 text-xs font-semibold text-white shadow-2xs">
                      {category.items.length}
                    </span>
                  </div>

                  {/* 技能列表：放大字号和图标间距 */}
                  <ul className="mb-4 space-y-2.5 pl-0.5">
                    {category.items.map((item) => {
                      const itemAccent = item.color || accent;

                      return (
                        <li
                          key={item.id}
                          className="flex items-center gap-2.5 text-sm font-medium text-slate-600"
                        >
                          {item.icon ? (
                            <div className="flex shrink-0 items-center justify-center rounded-md bg-slate-100/80">
                              <NotionIconDisplay
                                color={item.color ?? "none"}
                                icon={item.icon}
                                className="h-4 w-4"
                              />
                            </div>
                          ) : (
                            <span
                              className="h-2 w-2 shrink-0 rounded-full"
                              style={{ backgroundColor: itemAccent }}
                            />
                          )}

                          <span className="truncate">{item.title}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* 底部 Order */}
                <div className="mt-2 flex items-center justify-between border-t border-slate-200/80 pt-3 text-xs text-slate-400">
                  <span>Order: {Number(category.sortOrder + 1)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
