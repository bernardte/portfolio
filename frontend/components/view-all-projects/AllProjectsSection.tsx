// components/my-project-section/AllProjectsSection.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  FolderKanban,
  SlidersHorizontal,
  ArrowLeft
} from "lucide-react";
import ProjectCard from "@/components/my-project-section/ProjectCard";
import { ProjectResponse } from "@/lib/interface/portfolio.interface";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface AllProjectsSectionProps {
  projects: ProjectResponse[];
  slug: string;
}

export default function AllProjectsSection({
  projects,
  slug
}: AllProjectsSectionProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    projects.forEach((p) => p.projectTechStack.forEach((b) => tagSet.add(b)));
    return Array.from(tagSet).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesQuery =
        !q ||
        p.projectTitle.toLowerCase().includes(q) ||
        p.projectDescription.toLowerCase().includes(q);
      const matchesTag = !activeTag || p.projectTechStack.includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [projects, searchQuery, activeTag]);

  const hasActiveFilters = searchQuery.trim() !== "" || activeTag !== null;

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      {/* 背景装饰光晕 */}
      <div className="bg-brand-primary/10 pointer-events-none absolute -top-20 left-1/4 -z-10 h-72 w-72 rounded-full blur-[100px]" />
      <div className="pointer-events-none absolute -top-10 right-1/4 -z-10 h-72 w-72 rounded-full bg-purple-500/10 blur-[100px]" />

      {/* 返回按钮 */}

      <Link
        href={`/${slug}`}
        className={buttonVariants({
          variant: "ghost",
          className:
            "group border-brand-primary/10 bg-brand-card/50 hover:border-brand-primary/40 hover:bg-brand-card mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium text-neutral-400 transition-all hover:text-neutral-200"
        })}
      >
        <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        Back
      </Link>

      {/* 页头 */}
      <div className="mb-10 flex flex-col gap-3 sm:mb-12">
        <div className="flex items-center gap-2">
          <span className="text-brand-primary border-brand-primary/50 bg-brand-primary/5 flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium">
            <FolderKanban className="size-3.5" />
            Projects
          </span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
              Things I&rsquo;ve Built
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-neutral-400">
              A collection of everything I&rsquo;ve shipped — from full-stack
              apps to small experiments.
            </p>
          </div>
          <div className="border-brand-accent/10 bg-brand-card/50 hidden shrink-0 items-baseline gap-1.5 rounded-xl border px-4 py-2.5 sm:flex">
            <span className="text-brand-primary text-xl font-bold">
              {projects.length}
            </span>
            <span className="text-xs text-neutral-500">
              project{projects.length !== 1 ? "s" : ""} shipped
            </span>
          </div>
        </div>
      </div>

      {/* 搜索 + 标签筛选 */}
      <div className="border-brand-accent/10 bg-brand-card/30 mb-8 flex flex-col gap-4 rounded-2xl border p-4 backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="border-brand-accent/10 bg-brand-card focus:border-brand-primary/50 focus:ring-brand-primary/20 w-full rounded-xl border py-2.5 pr-9 pl-10 text-sm text-white transition placeholder:text-neutral-500 focus:ring-2 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500 transition hover:text-neutral-300"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="flex shrink-0 items-center gap-1.5 text-xs text-neutral-500">
              <SlidersHorizontal className="size-3.5" />
              <span className="hidden sm:inline">Filter by stack</span>
            </div>
          )}
        </div>

        {allTags.length > 0 && (
          <div className="-mx-1 flex scrollbar-none items-center gap-2 overflow-x-auto px-1 pb-0.5">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                activeTag === null
                  ? "bg-brand-primary border-brand-primary text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                  : "border-brand-accent/10 bg-brand-card hover:border-brand-primary/30 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                  activeTag === tag
                    ? "bg-brand-primary border-brand-primary text-white shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                    : "border-brand-accent/10 bg-brand-card hover:border-brand-primary/30 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 结果计数 */}
      {hasActiveFilters && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            {filteredProjects.length} project
            {filteredProjects.length !== 1 ? "s" : ""} found
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveTag(null);
            }}
            className="text-brand-primary text-xs font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* 项目网格 */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
              style={{
                animationDelay: `${Math.min(index, 8) * 60}ms`,
                animationDuration: "400ms"
              }}
            >
              <ProjectCard
                thumbnailImageUrl={project.projectThumbnailImage ?? ""}
                title={project.projectTitle}
                description={project.projectDescription}
                liveDemoUrl={project.projectLiveDemoUrl ?? ""}
                githubRepoUrl={project.projectRepositoryUrl ?? ""}
                badges={project.projectTechStack}
                isPublic={project.isPublic}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="border-brand-accent/10 bg-brand-card/50 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-20 text-center">
          <div className="bg-brand-accent/10 border-brand-accent/10 rounded-full border p-4">
            <FolderKanban className="text-brand-primary size-7" />
          </div>
          <p className="text-sm font-medium text-neutral-300">
            No projects match your search
          </p>
          <p className="max-w-sm text-xs text-neutral-500">
            Try a different keyword, or clear the filters to see everything
            I&rsquo;ve built.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveTag(null);
            }}
            className="text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 mt-2 rounded-lg px-4 py-2 text-xs font-medium transition"
          >
            Clear all filters
          </button>
        </div>
      )}
    </section>
  );
}
