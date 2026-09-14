// 在该文件顶部或单独组件中引入
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";

// 建议拆分为独立的 EmptyCategoryPlaceholder 组件
export const EmptySkillItemPlaceholder = ({ categoryId }: { categoryId: string }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `empty-${categoryId}`,
    data: {
      type: "EMPTY_CATEGORY",
      categoryId
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`col-span-full flex min-h-[100px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all duration-200 ${
        isOver
          ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-400/20"
          : "border-slate-200 bg-slate-50/50 hover:border-brand-primary hover:bg-brand-accent/10"
      }`}
    >
      <div
        className={`mb-2 rounded-full p-2 transition-colors ${
          isOver ? "bg-blue-100 text-blue-600" : "bg-brand-card/25 text-white"
        }`}
      >
        <Plus className="h-4 w-4" />
      </div>
      <p
        className={`text-xs font-medium ${
          isOver ? "text-blue-600" : "text-slate-500"
        }`}
      >
        {isOver ? "Drop item here" : "No skills added yet"}
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Drag items here or click{" "}
        <span className="inline-flex text-brand-primary items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 align-middle text-[11px] font-medium">
          <Plus className="h-3 w-3" />
          Add Skill
        </span>{" "}
        above
      </p>
    </div>
  );
};
