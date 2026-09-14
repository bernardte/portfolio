"use client";

import { useCallback, useRef, useState, useMemo, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  DragOverlay,
  DragCancelEvent
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { FolderPlus, GripVertical, Wrench } from "lucide-react";
import { CategoryModal } from "./CategoryModal";
import { SkillItemModal } from "./SkillItemModal";

import type { SkillItemFormValues } from "./SkillItemModal";
import type { CategoryFormValues } from "./CategoryModal";
import { Button } from "@/components/ui/button";
import {
  createSkillCategory,
  createSkillItem,
  removeCategory,
  removeSkillIttem,
  reorderCategory,
  reorderSkillItem,
  updateCategory,
  updateSkillItem
} from "@/lib/api/skill";
import {
  CreateSkillItem,
  SkillItemResponse
} from "@/lib/interface/skill.interface";
import { SkillCategoryResponse } from "@/lib/interface/skill.interface";
import { useToast } from "@/hook/use-toast";
import { ConfirmAlertDialog } from "@/components/share/dialog/ConfirmDeleteDialog";
import { SortableCategory } from "./SortableSkillCategory";
import { SortableSkillItem } from "./SortableSkillItem";
import { EmptySkillItemPlaceholder } from "./EmptySkillItemPlaceholder";
import { NotionIconDisplay } from "../../share/icon-picker/IconPickerPopover";

// ==========================================
// Isolated Sub-component for Category Items
// ==========================================
interface CategoryContainerProps {
  category: SkillCategoryResponse;
  index: number;
  onEditCategory: (cat: SkillCategoryResponse) => void;
  onDeleteCategory: (cat: SkillCategoryResponse) => void;
  onAddItem: (catId: string) => void;
  onEditItem: (item: SkillItemResponse) => void;
  onDeleteItem: (catId: string, itemId: string) => void;
}

const CategoryContainer = ({
  category,
  index,
  onEditCategory,
  onDeleteCategory,
  onAddItem,
  onEditItem,
  onDeleteItem
}: CategoryContainerProps) => {
  // Safe useMemo call inside a dedicated component!
  const itemIds = useMemo(
    () => category.items.map((item) => item.id),
    [category.items]
  );

  return (
    <SortableCategory
      category={category}
      index={index}
      onEdit={onEditCategory}
      onDelete={onDeleteCategory}
      onAddItem={onAddItem}
    >
      <SortableContext items={itemIds} strategy={rectSortingStrategy}>
        <div className="grid min-h-[70px] grid-cols-1 gap-3 p-4 sm:grid-cols-2 md:grid-cols-3">
          {category.items.map((item) => {
            return (
              <SortableSkillItem
                key={item.id}
                item={item}
                categoryId={category.id}
                onEdit={onEditItem}
                onDelete={onDeleteItem}
              />
            );
          })}

          {category.items.length === 0 && (
            <EmptySkillItemPlaceholder categoryId={category.id} />
          )}
        </div>
      </SortableContext>
    </SortableCategory>
  );
};

// ==========================================
// Main Component (SkillManagement)
// ==========================================

export const SkillManagement = ({
  categoriesData
}: {
  categoriesData: SkillCategoryResponse[];
}) => {
  const [categories, setCategories] =
    useState<SkillCategoryResponse[]>(categoriesData);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<SkillCategoryResponse | null>(null);

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [activeCategoryIdForItem, setActiveCategoryIdForItem] = useState("");
  const [editingItem, setEditingItem] = useState<SkillItemResponse | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [deleteCategoryTitle, setDeleteCategoryTitle] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { error, success } = useToast();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  );
  const [activeItem, setActiveItem] = useState<SkillItemResponse | null>(null);
  const [activeCategory, setActiveCategory] =
    useState<SkillCategoryResponse | null>(null);
  const previousCategoriesRef = useRef<SkillCategoryResponse[] | null>(null);
  const lastOverRef = useRef<string | null>(null);
  const dragStartCategoryIdRef = useRef<string | null>(null);
  const recentlyMovedRef = useRef<boolean>(false);

  const handleOpenCreateCategory = useCallback(() => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  }, []);

  const handleOpenEditCategory = useCallback((cat: SkillCategoryResponse) => {
    if (cat) {
      setEditingCategory(cat);
    }
    setIsCategoryModalOpen(true);
  }, []);

  const handleOpenCreateItem = useCallback((catId: string) => {
    setActiveCategoryIdForItem(catId);
    setEditingItem(null);
    setIsItemModalOpen(true);
  }, []);

  const handleOpenEditItem = useCallback((item: SkillItemResponse) => {
    setActiveCategoryIdForItem(item.categoryId);
    setEditingItem(item);
    setIsItemModalOpen(true);
  }, []);

  const handleDeleteCategory = useCallback(
    (category: SkillCategoryResponse) => {
      setDeleteCategoryId(category.id);
      setDeleteCategoryTitle(category.title);
      setDeleteDialogOpen(true);
    },
    []
  );

  const handleDeleteItem = useCallback(
    async (catId: string, itemId: string) => {
      try {
        await removeSkillIttem(itemId);
        setCategories((prev) =>
          prev.map((cat) => {
            if (cat.id === catId) {
              return {
                ...cat,
                items: cat.items.filter((i) => i.id !== itemId)
              };
            }
            return cat;
          })
        );
      } catch (errorMessage) {
        error(
          errorMessage instanceof Error
            ? errorMessage.message
            : "Internal Server Error"
        );
      }
    },
    [error]
  );

  const handleCategorySubmit = async (values: CategoryFormValues) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...values } : cat
        )
      );

      await updateCategory(editingCategory.id, {
        ...values,
        fileId: values.fileId ?? undefined
      });
      return;
    }

    const newCategory = {
      title: values.title,
      icon: values.icon ?? "",
      color: values.color ?? "gray",
      sortOrder: 0,
      fileId: values.fileId ?? undefined
    };

    const created = await createSkillCategory(newCategory);

    setCategories((prev) => [
      {
        ...(created as SkillCategoryResponse),
        sortOrder: 0,
        items: (created as SkillCategoryResponse).items ?? []
      },
      ...prev.map((c) => ({
        ...c,
        sortOrder: c.sortOrder + 1
      }))
    ]);
  };

  const handleSkillItemSubmit = async (values: SkillItemFormValues) => {
    if (editingItem) {
      const updatedItem = await updateSkillItem(editingItem.id, {
        title: values.title,
        icon: values.icon ?? "",
        color: values.color,
        categoryId: values.categoryId,
        fileId: values.fileId
      });

      if (!updatedItem) {
        error(`Failed to update ${values.title} skill`);
        return;
      }

      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === values.categoryId) {
            return {
              ...cat,
              items: cat.items.map((item) =>
                item.id === editingItem.id
                  ? {
                      ...item,
                      title: values.title,
                      icon: values.icon ?? "",
                      color: values.color
                    }
                  : item
              )
            };
          }
          return cat;
        })
      );

      success("Skill item update successfully!");
    } else {
      const newItem: CreateSkillItem = {
        title: values.title,
        icon: values.icon ?? "",
        categoryId: values.categoryId,
        sortOrder: 0,
        fileId: values.fileId,
        color: values.color
      };

      const createdItem = await createSkillItem(values.categoryId, newItem);

      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === values.categoryId) {
            return {
              ...cat,
              items: [
                createdItem,
                ...cat.items.map((i) => ({ ...i, sortOrder: i.sortOrder + 1 }))
              ]
            };
          }
          return cat;
        })
      );
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deleteCategoryId) return;

    try {
      setDeleteLoading(true);

      await removeCategory(deleteCategoryId);

      setCategories((prev) =>
        prev
          .filter((category) => category.id !== deleteCategoryId)
          .map((category, index) => ({
            ...category,
            sortOrder: index
          }))
      );

      success("Category deleted successfully");

      setDeleteDialogOpen(false);
    } catch (errorMessage: unknown) {
      error(
        errorMessage instanceof Error
          ? errorMessage.message
          : "Internal Server Error"
      );
    } finally {
      setDeleteLoading(false);
      setDeleteCategoryId(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      handleDragCancel();
      return;
    }

    setActiveItem(null);
    setActiveCategory(null);

    const activeType = active.data.current?.type;

    if (activeType === "CATEGORY") {
      const oldIndex = categories.findIndex(
        (category) => category.id === active.id
      );

      const newIndex = categories.findIndex(
        (category) => category.id === over.id
      );

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        previousCategoriesRef.current = null;
        return;
      }

      const reorderedCategories = arrayMove(categories, oldIndex, newIndex).map(
        (category, index) => ({
          ...category,
          sortOrder: index
        })
      );

      setCategories(reorderedCategories);

      try {
        await reorderCategory(
          reorderedCategories.map((category) => category.id)
        );
      } catch (error) {
        if (previousCategoriesRef.current) {
          setCategories(previousCategoriesRef.current);
        }
      }

      previousCategoriesRef.current = null;
      return;
    }

    if (activeType === "SKILL_ITEM") {
      const activeItemId = String(active.id);
      const overId = String(over.id);
      const sourceCategoryId = dragStartCategoryIdRef.current;

      if (!sourceCategoryId) {
        previousCategoriesRef.current = null;
        return;
      }

      // 注意：这里要在【当前 state】里找 item 现在所在的分类，
      // 而不是拖拽开始时的 source，因为 onDragOver 可能已经把它搬过去了
      const currentCategory = categories.find((cat) =>
        cat.items.some((item) => item.id === activeItemId)
      );

      if (!currentCategory) {
        previousCategoriesRef.current = null;
        return;
      }

      const oldIndex = currentCategory.items.findIndex(
        (item) => item.id === activeItemId
      );

      // over 目标在当前分类内的位置（可能是某个 item，也可能是空分类容器本身）
      let newIndex = currentCategory.items.findIndex(
        (item) => item.id === overId
      );
      if (newIndex === -1) {
        newIndex = currentCategory.items.length - 1; // 拖到分类容器/空占位上，放最后
      }

      if (oldIndex === -1) {
        previousCategoriesRef.current = null;
        return;
      }

      const reorderedItems = arrayMove(
        currentCategory.items,
        oldIndex,
        newIndex
      ).map((item, index) => ({ ...item, sortOrder: index }));

      const updatedCategories = categories.map((cat) =>
        cat.id === currentCategory.id ? { ...cat, items: reorderedItems } : cat
      );

      setCategories(updatedCategories);

      try {
        await reorderSkillItem(
          sourceCategoryId,
          currentCategory.id,
          reorderedItems.map((item) => item.id)
        );

        if (sourceCategoryId !== currentCategory.id) {
          success("Skills reordered successfully");
        }
      } catch (err) {
        console.error("Skill reorder failed:", err);
        if (previousCategoriesRef.current) {
          setCategories(previousCategoriesRef.current);
        }
      }

      previousCategoriesRef.current = null;
      lastOverRef.current = null; // 别忘了重置
      return;
    }
  };

  // dnd-kit 多容器拖拽经典坑（问题修复）
  useEffect(() => {
    recentlyMovedRef.current = true;
    const frame = requestAnimationFrame(() => {
      recentlyMovedRef.current = false;
    });

    return () => cancelAnimationFrame(frame);
  }, [categories]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    if (recentlyMovedRef.current) return;

    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;

    // 分类拖拽不需要手动处理，SortableContext 自己会做视觉重排
    if (activeType !== "SKILL_ITEM") return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    // 防抖：同一个 over 目标不重复触发 state 更新
    if (lastOverRef.current === overId) return;
    lastOverRef.current = overId;

    setCategories((prev) => {
      const sourceCategory = prev.find((cat) =>
        cat.items.some((item) => item.id === activeId)
      );
      if (!sourceCategory) return prev;

      let destinationCategory = prev.find((cat) => cat.id === overId);
      if (!destinationCategory) {
        destinationCategory = prev.find((cat) =>
          cat.items.some((item) => item.id === overId)
        );
      }
      if (!destinationCategory) return prev;

      const activeIndex = sourceCategory.items.findIndex(
        (item) => item.id === activeId
      );
      if (activeIndex === -1) return prev;

      if (sourceCategory.id === destinationCategory.id) {
        // 同分类内部交给 SortableContext 自身处理，这里不用管
        return prev;
      }

      const overIndex = destinationCategory.items.findIndex(
        (item) => item.id === overId
      );
      const insertIndex =
        overIndex >= 0 ? overIndex : destinationCategory.items.length;

      // 👇 关键防线：如果这就是当前状态（已经在目标分类、目标位置），不要再 setState
      const alreadyInPlace =
        destinationCategory.items[insertIndex]?.id === activeId;
      if (alreadyInPlace) return prev;

      const movedItem = {
        ...sourceCategory.items[activeIndex],
        categoryId: destinationCategory.id
      };

      const newSourceItems = sourceCategory.items.filter(
        (item) => item.id !== activeId
      );
      const newDestinationItems = [...destinationCategory.items];
      newDestinationItems.splice(insertIndex, 0, movedItem);

      return prev.map((cat) => {
        if (cat.id === sourceCategory.id)
          return { ...cat, items: newSourceItems };
        if (cat.id === destinationCategory.id)
          return { ...cat, items: newDestinationItems };
        return cat;
      });
    });
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    lastOverRef.current = null;
    const { active } = event;
    previousCategoriesRef.current = categories;

    if (active.data.current?.type === "CATEGORY") {
      const category = categories.find((category) => category.id === active.id);
      setActiveCategory(category || null);
    }

    if (active.data.current?.type === "SKILL_ITEM") {
      const item = categories
        .flatMap((c) => c.items)
        .find((i) => i.id === active.id);
      setActiveItem(item || null);

      // 记录拖动开始时 item 真正所属的分类,不受后续 dragOver 影响
      dragStartCategoryIdRef.current = item?.categoryId ?? null;
    }
  };

  const handleDragCancel = () => {
    lastOverRef.current = null;
    setActiveItem(null);
    setActiveCategory(null);

    if (previousCategoriesRef.current) {
      setCategories(previousCategoriesRef.current);
    }

    previousCategoriesRef.current = null;
  };

  const categoryIds = useMemo(
    () => categories.map((category) => category.id),
    [categories]
  );

  return (
    <div className="mx-auto min-h-screen max-w-5xl space-y-6 bg-slate-50 p-6 text-slate-800">
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Skills Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Drag and drop to reorder categories or items.
          </p>
        </div>
        <Button
          variant={"default"}
          onClick={handleOpenCreateCategory}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition"
        >
          <FolderPlus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
      >
        <SortableContext
          items={categoryIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <CategoryContainer
                  key={category.id}
                  category={category}
                  index={index}
                  onEditCategory={handleOpenEditCategory}
                  onDeleteCategory={handleDeleteCategory}
                  onAddItem={handleOpenCreateItem}
                  onEditItem={handleOpenEditItem}
                  onDeleteItem={handleDeleteItem}
                />
              ))
            ) : (
              <div
                role="status"
                aria-label="No skill categories available"
                className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <FolderPlus className="size-7" />
                </div>
                <h3 className="text-base font-semibold text-slate-700">
                  No categories yet
                </h3>
                <p className="max-w-sm text-sm leading-relaxed text-slate-500">
                  Get started by creating your first skill category. You can
                  then add skills and drag to reorder them.
                </p>
             
              </div>
            )}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeItem ? (
            <div className="pointer-events-none flex items-center justify-between rounded-lg border bg-white p-3 shadow-xl">
              <div className="flex min-w-0 items-center gap-2.5">
                <GripVertical className="h-4 w-4 text-slate-300" />

                {activeItem.icon ? (
                  <NotionIconDisplay
                    icon={activeItem.icon}
                    color={activeItem.color ?? "gray"}
                    className="h-5 w-5 shrink-0"
                  />
                ) : (
                  <Wrench className="h-4 w-4 shrink-0 text-slate-400" />
                )}

                <span className="truncate text-sm font-medium text-slate-700">
                  {activeItem.title}
                </span>
              </div>
            </div>
          ) : activeCategory ? (
            <div className="pointer-events-none rounded-xl border bg-white p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <GripVertical className="h-5 w-5 text-slate-400" />

                <NotionIconDisplay
                  icon={activeCategory.icon}
                  color={activeCategory.color}
                  className="h-5 w-5"
                />

                <div>
                  <h3 className="text-base font-semibold text-slate-800">
                    {activeCategory.title}
                  </h3>

                  <span className="text-xs text-slate-400">
                    {activeCategory.items.length} Skills
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleCategorySubmit}
        initialValues={
          editingCategory
            ? {
                title: editingCategory.title,
                icon: editingCategory.icon,
                color: editingCategory.color
              }
            : null
        }
      />

      <SkillItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSubmit={handleSkillItemSubmit}
        categoryId={activeCategoryIdForItem}
        initialValues={editingItem}
      />

      <ConfirmAlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete category?"
        description={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">
              "{deleteCategoryTitle}"
            </span>
            ? This action cannot be undone and all skills inside this category
            will also be deleted.
          </>
        }
        confirmText="Delete"
        loadingText="Deleting..."
        loading={deleteLoading}
        onConfirm={handleConfirmDeleteCategory}
        destructive
      />
    </div>
  );
};
