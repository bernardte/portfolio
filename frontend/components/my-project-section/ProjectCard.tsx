import Image from "next/image";
import ProjectBadges from "./ProjectBadges";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { MoveUpRight, Globe, Lock, ImageOff } from "lucide-react";

interface PostCardProps {
  thumbnailImageUrl: string;
  title: string;
  description: string;
  liveDemoUrl: string;
  githubRepoUrl: string;
  badges: string[];
  isPublic: boolean;
}

export default function ProjectCard({
  thumbnailImageUrl,
  title,
  description,
  liveDemoUrl,
  githubRepoUrl,
  badges,
  isPublic
}: PostCardProps) {
  const hasThumbnail = Boolean(thumbnailImageUrl && thumbnailImageUrl.trim());

  return (
    <div className="group border-brand-accent/10 hover:border-brand-primary/40 relative flex h-full w-full flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(59,130,246,0.25)]">
      {/* Thumbnail image */}
      <div className="bg-muted relative aspect-video w-full">
        {hasThumbnail ? (
          <Image
            src={thumbnailImageUrl}
            alt={`${title} thumbnail`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            role="img"
            aria-label="No thumbnail available"
            className="text-muted-foreground/60 flex h-full w-full items-center justify-center"
          >
            <ImageOff className="size-8" />
          </div>
        )}

        {/* 可见性标签：Public / Private */}
        <span
          aria-label={isPublic ? "Public project" : "Private project"}
          title={isPublic ? "Public project" : "Private project"}
          className={`absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide backdrop-blur-md transition-colors ${
            isPublic
              ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-300"
              : "border-amber-400/30 bg-amber-500/15 text-amber-300"
          }`}
        >
          {isPublic ? (
            <Globe className="size-3" />
          ) : (
            <Lock className="size-3" />
          )}
          {isPublic ? "Public" : "Private"}
        </span>

        {/* 底部渐变遮罩，让缩略图和内容区过渡更自然 */}
        <div className="from-brand-accent/20 pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t to-transparent" />
      </div>

      {/* content */}
      <div className="bg-brand-card flex min-w-0 flex-1 flex-col gap-3 p-4">
        {/* title */}
        <h3 className="text-md truncate font-medium text-white/80">{title}</h3>

        {/* description */}
        <p className="line-clamp-2 text-sm leading-relaxed text-neutral-400">
          {description}
        </p>

        {/* badges - Grid*/}
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <ProjectBadges key={index} badge={badge} />
          ))}
        </div>

        {/* Button */}
        <div className="mt-auto flex items-center justify-between pt-2">
          {liveDemoUrl ? (
            <Link
              href={liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                variant: "ghost",
                className:
                  "text-brand-primary flex items-center gap-1.5 border-none text-sm"
              })}
            >
              <span className="text-brand-primary flex items-center gap-1.5 text-sm">
                Live Demo
                <MoveUpRight className="size-3.5" />
              </span>
            </Link>
          ) : (
            <span /> // 占位，保持 justify-between 布局不塌陷
          )}

          {githubRepoUrl && isPublic && (
            <Link
              href={githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                variant: "ghost",
                className: "text-brand-primary border-none px-0"
              })}
            >
              <span className="text-brand-primary flex items-center gap-1.5 text-sm">
                GitHub
                <MoveUpRight className="size-3.5" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
