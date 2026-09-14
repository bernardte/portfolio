import { SkillCategoryResponse } from "@/lib/interface/skill.interface";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { NotionIconDisplay } from "../../share/icon-picker/IconPickerPopover";
import { memo } from "react";

export const SortableCategory = memo(
  ({
    category,
    index,
    children,
    onEdit,
    onDelete,
    onAddItem
  }: {
    category: SkillCategoryResponse;
    index: number;
    children: React.ReactNode;
    onEdit: (category: SkillCategoryResponse) => void;
    onDelete: (category: SkillCategoryResponse) => void;
    onAddItem: (categoryId: string) => void;
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({
      id: category.id,
      data: {
        type: "CATEGORY"
      }
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={`rounded-xl border bg-white shadow-sm transition-all ${
          isDragging
            ? "border-indigo-500 shadow-lg ring-2 ring-indigo-500/20"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        {/* Category Header */}
        <div className="flex items-center justify-between rounded-t-xl border-b border-slate-100 bg-slate-50/50 p-4">
          <div className="flex items-center gap-3">
            <div
              {...listeners}
              className="cursor-grab rounded p-1 text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-600 active:cursor-grabbing"
            >
              <GripVertical className="h-5 w-5" />
            </div>

            <NotionIconDisplay
              icon={category.icon}
              color={category.color}
              className="h-5 w-5"
            />

            <div>
              <h3 className="text-base font-semibold text-slate-800">
                {category.title}
              </h3>

              <span className="text-xs text-slate-400">
                {category.items.length} Skills
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onAddItem(category.id)}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Skill
            </button>

            <button
              onClick={() => onEdit(category)}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              onClick={() => onDelete(category)}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {children}
      </div>
    );
  }
);
