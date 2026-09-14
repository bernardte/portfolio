"use client";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotionIconDisplay } from "@/components/share/icon-picker/IconPickerPopover"; // 按实际路径调整
import SortableRow, { DragHandle } from "@/components/share/sort/SortableRow";
import { StrengthsResponse } from "@/lib/interface/strength.interface";

export default function StrengthsSection({
  items = [],
  onEdit,
  onDelete,
  onMove,
  onReorder,
  isLoading
}: {
  items?: StrengthsResponse[];
  onEdit?: (item: StrengthsResponse) => void;
  onDelete?: (id: string) => void;
  onMove?: (id: string, direction: "up" | "down") => void;
  onReorder?: (orderedIds: string[]) => void;
  isLoading: boolean;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 } // 轻微点击不触发拖拽，避免误触
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const next = [...items];
    const [moved] = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, moved);

    onReorder?.(next.map((item) => item.id));
  };

  if (items.length === 0) {
    return (
      <div className="border-border/60 flex h-full min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed">
        <p className="text-muted-foreground text-sm">No strengths yet</p>
        <p className="text-muted-foreground/70 text-xs">
          Click "Add Strength" to showcase your top skills
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="border-border/60 divide-border/60 bg-card flex flex-1 flex-col divide-y overflow-hidden rounded-xl border">
          {items.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === items.length - 1;

            return (
              <SortableRow key={item.id} id={item.id}>
                {({ attributes, listeners }) => (
                  <div className="hover:bg-muted/30 group bg-card flex items-center justify-between px-4 py-3.5 transition-colors">
                    <div className="flex min-w-0 items-center gap-3">
                      <DragHandle
                        attributes={attributes}
                        listeners={listeners}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      />

                      {/* 键盘/无障碍用户的备用排序方式，保留上下箭头 */}
                      <div className="flex flex-col opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          disabled={isFirst || isLoading}
                          onClick={() => onMove?.(item.id, "up")}
                          aria-label="Move up"
                          className="text-muted-foreground/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-20"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={isLast || isLoading}
                          onClick={() => onMove?.(item.id, "down")}
                          aria-label="Move down"
                          className="text-muted-foreground/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-20"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <NotionIconDisplay
                        icon={item.icon}
                        color={item.color}
                        className="h-4 w-4"
                      />

                      <div className="min-w-0">
                        <h4 className="text-foreground truncate text-sm font-semibold">
                          {item.title}
                        </h4>
                        <p className="text-muted-foreground truncate text-xs">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={isLoading}
                        onClick={() => onEdit?.(item)}
                        aria-label={`Edit ${item.title}`}
                        className="border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground disabled:text-muted-foreground/30 h-8 w-8 rounded-lg disabled:pointer-events-none disabled:opacity-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        disabled={isLoading}
                        onClick={() => onDelete?.(item.id)}
                        aria-label={`Delete ${item.title}`}
                        className="disabled:text-muted-foreground/30 h-8 w-8 rounded-lg border-red-200/60 bg-red-50/20 text-red-500 hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-50 dark:border-red-900/30 dark:bg-red-950/20 dark:hover:bg-red-950/50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </SortableRow>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
