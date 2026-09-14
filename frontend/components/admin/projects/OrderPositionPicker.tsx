"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { GripVertical, Sparkles } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// create 模式下项目还没有真实 id，用这个占位符表示"当前正在创建的这一行"
const NEW_ITEM_PLACEHOLDER_ID = "__new-item__";

export interface ExistingProject {
  id: string;
  title: string;
  thumbnailUrl: string | null;
}

interface Row {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  isCurrent: boolean;
}

interface OrderPositionPickerProps {
  mode: "create" | "edit";
  // 理想情况下不包含当前正在创建/编辑的这一个；
  // 组件内部也会做防御性过滤，避免父级不小心传漏 filter 导致重复卡片。
  existingProjects: ExistingProject[];
  currentTitle: string;
  currentThumbnail: string | null;
  // edit 模式下必传，用于把"当前编辑项"和 existingProjects 里的真实记录关联起来，
  // 避免额外渲染一张重复的虚拟卡片。
  currentProjectId: string | null;
  // edit 模式下传入这个项目原本所在的位置，不传就默认排到最后（create 场景）
  initialIndex?: number;
  // orderedIds: 当前完整顺序对应的真实 id 数组（edit 模式下可直接发给 reorder 接口）。
  //   create 模式下，当前这一行还没有真实 id，会用占位符代替，调用方应忽略它，只用 currentIndex。
  // currentIndex: 当前编辑/创建项目在列表里的位置（0-based）。
  onPositionChange: (orderedIds: string[], currentIndex: number) => void;
}

function SortableRow({
  row,
  index,
  badgeLabel
}: {
  row: Row;
  index: number;
  badgeLabel: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-xl border p-2.5 ${
        row.isCurrent
          ? "border-indigo-200 bg-indigo-50/60"
          : "border-gray-100 bg-white"
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-300 hover:text-gray-500 active:cursor-grabbing"
        aria-label="拖拽调整顺序"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          row.isCurrent
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {index + 1}
      </span>

      <div className="relative h-9 w-14 shrink-0 overflow-hidden rounded-md bg-gray-100">
        {row.thumbnailUrl && (
          <Image
            src={row.thumbnailUrl}
            alt={row.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </div>

      <span className="truncate text-sm font-medium text-gray-700">
        {row.title || (row.isCurrent ? "Untitled project" : "")}
      </span>

      {row.isCurrent && (
        <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600">
          <Sparkles className="h-3 w-3" />
          {badgeLabel}
        </span>
      )}
    </div>
  );
}

export default function OrderPositionPicker({
  mode,
  existingProjects,
  currentTitle,
  currentThumbnail,
  currentProjectId,
  initialIndex,
  onPositionChange
}: OrderPositionPickerProps) {
  const badgeLabel = mode === "create" ? "New" : "Editing";

  // edit 模式下，"当前项目"这一行直接复用它在数据库里的真实 id，
  // 而不是造一个虚拟占位符 —— 这样它和 existingProjects 里的记录是同一个身份，
  // 不会出现"真实卡片 + 虚拟卡片"两张重复展示同一个项目的情况。
  // create 模式下项目还没落库，只能用占位符。
  const currentRowId =
    mode === "edit" && currentProjectId
      ? currentProjectId
      : NEW_ITEM_PLACEHOLDER_ID;

  // 防御性过滤：无论父级有没有正确排除当前项目，这里都强制去重一次，
  // 避免因为父级 fetch 逻辑改动导致列表里出现两张同一项目的卡片。
  const dedupedExisting = useMemo(
    () => existingProjects.filter((p) => p.id !== currentRowId),
    [existingProjects, currentRowId]
  );

  // 只在 dedupedExisting 变化时重建初始顺序，避免每次输入标题都把用户
  // 已经拖好的位置重置掉。edit 模式下把当前项目插回它原来的位置，
  // 而不是每次都甩到最后。
  const initialRows = useMemo<Row[]>(() => {
    const others: Row[] = dedupedExisting.map((p) => ({
      id: p.id,
      title: p.title,
      thumbnailUrl: p.thumbnailUrl,
      isCurrent: false
    }));

    const currentRow: Row = {
      id: currentRowId,
      title: currentTitle,
      thumbnailUrl: currentThumbnail,
      isCurrent: true
    };

    const insertAt =
      initialIndex !== undefined
        ? Math.min(Math.max(initialIndex, 0), others.length)
        : others.length;

    const rows = [...others];
    rows.splice(insertAt, 0, currentRow);
    return rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dedupedExisting]);

  const [rows, setRows] = useState<Row[]>(initialRows);

  // 输入标题 / 换缩略图时，只更新当前这一行的展示内容，不改变它在
  // 列表里的位置。
  useEffect(() => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === currentRowId
          ? { ...row, title: currentTitle, thumbnailUrl: currentThumbnail }
          : row
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTitle, currentThumbnail]);

  useEffect(() => {
    const index = rows.findIndex((r) => r.id === currentRowId);
    const orderedIds = rows.map((r) => r.id);
    if (index !== -1) onPositionChange(orderedIds, index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setRows((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900">Display order</h2>
      <p className="mt-1 text-xs text-gray-500">
        {mode === "create"
          ? "Drag the highlighted card to place the new item where you want it."
          : "Drag the highlighted card to move this project to a new position."}
      </p>

      <DndContext
        id="order-position-picker-dnd"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={rows.map((r) => r.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="mt-4 space-y-2">
            {rows.map((row, index) => (
              <SortableRow
                key={row.id || index}
                row={row}
                index={index}
                badgeLabel={badgeLabel}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {dedupedExisting.length === 0 && (
        <p className="mt-3 text-xs text-gray-400">
          There are no other projects yet; this will be the only one showcased.
        </p>
      )}
    </div>
  );
}
