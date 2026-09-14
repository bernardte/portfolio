"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GripVertical, Plus, ChevronUp, ChevronDown, FolderPlus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SOCIAL_LINK } from "@/constants/adminProjectCardSocialLink";
import { useMediaQuery } from "@/hook/use-media-query";
import {
  findAllProjectApi,
  removeProject,
  reorderProjectApi,
  toggleChecked
} from "@/lib/api/project";
import Link from "next/link";
import { ProjectsResponseData } from "@/lib/interface/project.interface";
import { useToast } from "@/hook/use-toast";

function SortableProjectCard({
  project,
  index,
  total,
  onMove,
  onToggleVisibility,
  onToggleRemoveProject
}: {
  project: any;
  index: number;
  total: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  onToggleVisibility: (projectId: string, isPublic: boolean) => void;
  onToggleRemoveProject: (projectId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 10 } : {}),
    opacity: isDragging ? 0.6 : 1
  };

  const maxBadges = 3;
  const visibleBadges = project.projectTechStack?.slice(0, maxBadges) || [];
  const extraCount = (project.projectTechStack?.length || 0) - maxBadges;

  const isPublicChecked = Boolean(project.isPublic);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col justify-between rounded-2xl border border-gray-300 bg-white p-3 shadow-sm sm:p-4"
    >
      {/* 📱 移动端布局 (< sm): 高密度列表行 */}
      <div className="flex items-center gap-2.5 sm:hidden">
        {/* 1. 拖拽手柄 */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none p-1 text-gray-400 hover:text-gray-600 active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        {/* 2. 序号 */}
        <span className="bg-brand-accent flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-semibold text-white">
          {index + 1}
        </span>

        {/* 3. 微型图片预览 */}
        <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-gray-200">
          {project.projectThumbnailImage ? (
            <Image
              alt={project.projectTitle}
              src={project.projectThumbnailImage}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            /* 可选：没有图片时显示的 Placeholder */
            <span className="text-[10px] text-gray-400">No Image</span>
          )}
        </div>

        {/* 4. 标题与状态开关 */}
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <h3 className="truncate text-sm font-bold text-black">
            {project.title}
          </h3>
          <Switch
            size="default"
            checked={isPublicChecked}
            onPointerDown={(e) => e.stopPropagation()}
            onCheckedChange={(checked) =>
              onToggleVisibility(project.id, checked)
            }
          />
        </div>

        {/* 5. 辅助上下移动按钮（兜底无障碍体验） */}
        <div className="flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => onMove(index, index - 1)}
            disabled={index === 0}
            className="rounded p-0.5 text-gray-400 hover:bg-gray-100 disabled:opacity-20"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, index + 1)}
            disabled={index === total - 1}
            className="rounded p-0.5 text-gray-400 hover:bg-gray-100 disabled:opacity-20"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 💻 桌面端布局 (>= sm): 保持原有的完整卡片结构 */}
      <div className="hidden sm:block">
        {/* 1. 顶部预览图片与序号 */}
        <div className="relative inset-0 z-10">
          <div className="border-brand-card/15 relative aspect-[16/9] w-full overflow-hidden rounded-xl border">
            <div className="bg-brand-accent pointer-events-none absolute top-2.5 left-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold text-white antialiased shadow-md select-none">
              {index + 1}
            </div>

            {project.projectThumbnailImage ? (
              <Image
                alt={project.projectTitle}
                src={project.projectThumbnailImage}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              /* 可选：没有图片时显示的 Placeholder */
              <span className="text-[10px] text-gray-400">No Image</span>
            )}
          </div>
        </div>

        {/* 2. 内容主体 */}
        <div className="mt-3.5 flex items-start gap-1.5">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="mt-0.5 cursor-grab touch-none text-gray-400 hover:text-gray-600 focus:outline-none active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-bold text-black">
                {project.projectTitle}
              </h3>
              <Switch
                size="default"
                checked={!!project.isPublic}
                onPointerDown={(e) => e.stopPropagation()}
                onCheckedChange={(checked) =>
                  onToggleVisibility(project.id, checked)
                }
              />
            </div>

            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-black/50">
              {project.projectDescription}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {visibleBadges.map((badge: string) => (
                <span
                  key={badge}
                  className="bg-brand-primary/20 rounded-sm px-2.5 py-1 text-xs font-medium text-gray-500"
                >
                  {badge}
                </span>
              ))}
              {extraCount > 0 && (
                <span className="bg-brand-primary/20 rounded-sm px-2 py-1 text-xs font-medium text-gray-400">
                  +{extraCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. 底部操作栏（两端通用） */}
      <div className="mt-3 flex items-center justify-between border-t border-gray-100/80 pt-2.5 sm:mt-4 sm:pt-3">
        {SOCIAL_LINK.map((item, i) => {
          const Icon = item.Icon;

          // 1. 编辑 (Edit) - 使用 Link
          if (item.label === "Edit") {
            return (
              <div key={item.label || i} className="flex items-center gap-2">
                <Link
                  href={`/admin/projects/edit/${project.id}`}
                  className={item.className}
                  aria-label={item.label}
                >
                  <Icon size={14} />
                </Link>
                {item.hasDivider && <div className="h-6 w-[1px] bg-gray-300" />}
              </div>
            );
          }

          // 2. 删除 (Delete) - 使用 button 按钮 (必须使用 onClick)
          if (item.label === "Delete") {
            return (
              <div key={item.label || i} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleRemoveProject(project.id)}
                  className={item.className}
                  aria-label={item.label}
                >
                  <Icon size={14} />
                </button>
                {item.hasDivider && <div className="h-6 w-[1px] bg-gray-300" />}
              </div>
            );
          }

          // 3. 外部链接 (GitHub / Live Demo) - 使用 <a> 标签
          const href =
            item.label === "GitHub"
              ? project.projectRepositoryUrl
              : item.label === "Live Demo"
                ? project.projectLiveDemoUrl
                : "#";

          return (
            <div key={item.label || i} className="flex items-center gap-2">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={item.className}
                aria-label={item.label}
              >
                <Icon size={14} />
              </a>
              {item.hasDivider && <div className="h-6 w-[1px] bg-gray-300" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProjectSection({
  isFullList
}: {
  isFullList?: boolean;
}) {
  const [projects, setProjects] = useState<ProjectsResponseData[]>([]);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { error } = useToast();

  useEffect(() => {
    const handleFetchProjects = async () => {
      const allProject = await findAllProjectApi();
      setProjects(allProject);
    };

    handleFetchProjects();
  }, []);

  const updateProjectOrder = async (newProject: ProjectsResponseData[]) => {
    setProjects(newProject);

    const orderIds = newProject.map((p) => p.id);

    try {
      const updatedList = await reorderProjectApi(orderIds);

      if (updatedList.length) {
        setProjects(updatedList);
      }
    } catch (errorMessage: any) {
      error(
        errorMessage instanceof Error ? errorMessage.message : errorMessage
      );
    }
  };

  // 使用 MouseSensor 替换 PointerSensor，避免与 TouchSensor 争抢移动端手势
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 移动端按住 200ms 后激活拖拽，防止误操作
        tolerance: 5
      }
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((item) => item.id === active.id);
      const newIndex = projects.findIndex((item) => item.id === over.id);
      const newOrderedProjects = arrayMove(projects, oldIndex, newIndex);
      updateProjectOrder(newOrderedProjects);
    }
  };

  const handleManualMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= projects.length) return;

    const newOrderedProjects = arrayMove(projects, fromIndex, toIndex);

    updateProjectOrder(newOrderedProjects);
  };

  async function handleToggleVisibility(projectId: string, isPublic: boolean) {
    setProjects((prev) =>
      prev.map((item) =>
        item.id === projectId ? { ...item, isPublic: isPublic } : item
      )
    );

    try {
      await toggleChecked(projectId, {
        isPublic: isPublic
      });
    } catch (errorMessage: any) {
      error(
        errorMessage instanceof Error ? errorMessage.message : errorMessage
      );
    }
  }

  async function handleToggleRemoveProject(id: string) {
    try {
      setProjects((prev) => prev.filter((item) => item.id !== id));
      await removeProject(id);
    } catch (errorMessage: any) {
      error(
        errorMessage instanceof Error ? errorMessage.message : errorMessage
      );
    }
  }

  const sliceProjectCard = isFullList ? projects : projects.slice(0, 3);
  const isEmpty = projects.length === 0;

  return (
    <DndContext
      id="order-position-picker-dnd"
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={
            isMobile ? verticalListSortingStrategy : rectSortingStrategy
          }
        >
          {sliceProjectCard.map((project, index) => {
            return (
              <SortableProjectCard
                key={project.id}
                project={project}
                index={index}
                total={sliceProjectCard.length}
                onMove={handleManualMove}
                onToggleVisibility={handleToggleVisibility}
                onToggleRemoveProject={handleToggleRemoveProject}
              />
            );
          })}
        </SortableContext>

        {/* 空状态：占满整行，替代网格中的普通 Add 卡片 */}
        {isEmpty ? (
          <div
            role="status"
            aria-label="No projects available"
            className="col-span-full flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-gray-200 bg-white px-6 py-16 text-center"
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <FolderPlus className="size-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-gray-900">
                No projects yet
              </h3>
              <p className="max-w-sm text-sm leading-relaxed text-gray-500">
                Get started by creating your first project. Showcase your
                amazing work to the world.
              </p>
            </div>
            <Link
              href="/admin/projects/create"
              className="bg-brand-accent hover:bg-brand-accent/90 mt-2 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add New Project
            </Link>
          </div>
        ) : (
          /* 有项目时保留原来的 Add New Project 卡片 */
          <Link
            href="/admin/projects/create"
            className="hover:border-brand-card/30 flex min-h-[80px] flex-row items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-white p-4 transition-colors sm:min-h-[320px] sm:flex-col sm:p-6"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 sm:h-10 sm:w-10">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="text-left sm:text-center">
              <span className="block text-sm font-semibold text-gray-900">
                Add New Project
              </span>
              <span className="mt-0.5 block text-xs text-gray-400">
                Showcase your amazing work
              </span>
            </div>
          </Link>
        )}
      </div>
    </DndContext>
  );
}
