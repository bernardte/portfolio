// components/admin/shared/SortableRow.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { ReactNode } from "react";

interface SortableRowProps {
  id: string;
  children: (drag: {
    attributes: ReturnType<typeof useSortable>["attributes"];
    listeners: ReturnType<typeof useSortable>["listeners"];
  }) => ReactNode;
  className?: string;
}

export default function SortableRow({
  id,
  children,
  className = ""
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition
      }}
      className={`${className} ${isDragging ? "relative z-10 opacity-60" : ""}`}
    >
      {children({ attributes, listeners })}
    </div>
  );
}

export function DragHandle({
  attributes,
  listeners,
  className = ""
}: {
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
  className?: string;
}) {
  return (
    <button
      type="button"
      {...attributes}
      {...listeners}
      aria-label="Drag to reorder"
      className={`text-muted-foreground/30 hover:text-muted-foreground cursor-grab touch-none active:cursor-grabbing ${className}`}
    >
      <GripVertical className="h-4 w-4" />
    </button>
  );
}
