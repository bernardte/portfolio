"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, FolderOpen } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { ProjectResponse } from "@/lib/interface/portfolio.interface";

const BREAK_POINT = [
  { minWidth: 1280, item: 4 },
  { minWidth: 1024, item: 3 },
  { minWidth: 768, item: 2 },
  { minWidth: 0, item: 1 }
];

const AUTO_PLAY_INTERVAL = 4000; // 4 seconds

interface ProjectProps {
  projects: ProjectResponse[];
}

export default function ProjectCarousel({ projects }: ProjectProps) {
  const [itemPerView, setItemPerView] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const updateItemPerView = () => {
      const currentBreakPoint = BREAK_POINT.find(
        (breakpoint) => window.innerWidth >= breakpoint.minWidth
      );
      setItemPerView(currentBreakPoint?.item ?? 1);
    };

    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateItemPerView, 150);
    };

    updateItemPerView();
    window.addEventListener("resize", debouncedUpdate);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedUpdate);
    };
  }, []);

  const maxIndex = Math.max(0, projects.length - itemPerView);
  const hasMultiplePages = maxIndex > 0;

  const handlePrevious = useCallback(() => {
    setCurrentIndex((previous) => (previous <= 0 ? 0 : previous - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((previous) =>
      previous >= maxIndex ? maxIndex : previous + 1
    );
  }, [maxIndex]);

  useEffect(() => {
    // avoid screen resize not exceed the maximum value of the screen
    setCurrentIndex((previous) => Math.min(previous, maxIndex));
  }, [maxIndex]);

  // auto-play: loop back to start when reaching the end
  useEffect(() => {
    if (!hasMultiplePages || isPaused) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((previous) => (previous >= maxIndex ? 0 : previous + 1));
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hasMultiplePages, isPaused, maxIndex]);

  // pause autoplay briefly after manual interaction, then resume
  const pauseAndResumeLater = useCallback(() => {
    setIsPaused(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const timeoutId = setTimeout(() => {
      setIsPaused(false);
    }, AUTO_PLAY_INTERVAL);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleManualPrevious = useCallback(() => {
    handlePrevious();
    pauseAndResumeLater();
  }, [handlePrevious, pauseAndResumeLater]);

  const handleManualNext = useCallback(() => {
    handleNext();
    pauseAndResumeLater();
  }, [handleNext, pauseAndResumeLater]);

  const handleDotClick = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      pauseAndResumeLater();
    },
    [pauseAndResumeLater]
  );

  // keyboard navigation (left/right arrow keys)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handleManualPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      handleManualNext();
    }
  };

  // empty state
  if (projects.length === 0) {
    return (
      <div
        role="status"
        aria-label="No projects available"
        className="border-brand-accent/10 bg-brand-card/40 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center"
      >
        <div className="bg-brand-accent/10 text-brand-primary flex size-14 items-center justify-center rounded-full">
          <FolderOpen className="size-7" />
        </div>
        <h3 className="text-md font-medium text-white/80">No projects yet</h3>
        <p className="max-w-sm text-sm leading-relaxed text-neutral-400">
          There are no projects to display at the moment. Please check back
          later.
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative"
      tabIndex={hasMultiplePages ? 0 : -1}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Project carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemPerView)}%)`
            }}
          >
            {projects.map((project) => (
              // adjust card width depends on the device screen size
              <div
                key={project.id}
                className="shrink-0 px-3"
                style={{
                  width: `${100 / itemPerView}%`
                }}
              >
                <ProjectCard
                  thumbnailImageUrl={project.projectThumbnailImage ?? ""}
                  title={project.projectTitle}
                  description={project.projectDescription}
                  liveDemoUrl={project.projectLiveDemoUrl ?? ""}
                  badges={project.projectTechStack ?? []}
                  githubRepoUrl={project.projectRepositoryUrl ?? ""}
                  isPublic={project.isPublic}
                />
              </div>
            ))}
          </div>
        </div>

        {/* floating side buttons */}
        {hasMultiplePages && (
          <>
            <Button
              size="icon"
              variant="ghost"
              disabled={currentIndex === 0}
              onClick={handleManualPrevious}
              aria-label="Previous projects"
              className="absolute top-1/2 left-2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 disabled:opacity-0"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              disabled={currentIndex === maxIndex}
              onClick={handleManualNext}
              aria-label="Next projects"
              className="absolute top-1/2 right-2 z-20 translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 disabled:opacity-0"
            >
              <ChevronRight />
            </Button>
          </>
        )}
      </div>

      {/* dot indicators */}
      {hasMultiplePages && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "bg-brand-accent w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2"
              }`}
              aria-label={`Go to project ${index + 1}`}
              aria-current={currentIndex === index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
