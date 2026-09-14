import { SkillItemResponse } from "@/lib/interface/skill.interface";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical, Pencil, Trash2, Wrench } from "lucide-react";
import { NotionIconDisplay } from "../../share/icon-picker/IconPickerPopover";
import { CSS } from "@dnd-kit/utilities";
import { memo } from "react";

export const SortableSkillItem = memo(
  ({
    item,
    categoryId,
    onEdit,
    onDelete
  }: {
    item: SkillItemResponse;
    categoryId: string;
    onEdit: (item: SkillItemResponse) => void;
    onDelete: (categoryId: string, itemId: string) => void;
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({
      id: item.id,
      data: {
        type: "SKILL_ITEM",
        categoryId
      }
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.4 : 1
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={`flex min-w-0 items-center justify-between rounded-lg border bg-white p-3 transition ${
          isDragging
            ? "z-10 border-indigo-400 shadow-md ring-2 ring-indigo-400/20"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            {...listeners}
            className="cursor-grab text-slate-300 hover:text-slate-500 active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </div>

          {item.icon ? (
            <NotionIconDisplay
              icon={item.icon}
              color={item.color ?? "gray"}
              className="h-5 w-5 shrink-0"
            />
          ) : (
            <Wrench className="h-4 w-4 shrink-0 text-slate-400" />
          )}

          <span className="truncate text-sm font-medium text-slate-700">
            {item.title}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => onEdit(item)}
            className="rounded p-1 text-slate-400 transition hover:text-slate-600"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => onDelete(categoryId, item.id)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }
);
