import { ArrowRight, FolderGit2 } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import ProjectCarousel from "./ProjectCarousel";
import { ProjectResponse } from "@/lib/interface/portfolio.interface";

export default function MyProjectSection({ projects, slug } : { projects: ProjectResponse[], slug: string }) {
  return (
    <section id="project" className="mx-auto mt-12 max-w-7xl space-y-3 px-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-brand-primary flex max-w-7xl items-center gap-2 font-medium">
          <FolderGit2 />
          Features Projects
        </div>

        <Link
          className={cn(
            buttonVariants({
              variant: "ghost",
              className: "border-brand-accent text-brand-primary border"
            })
          )}
          href={`/${slug}/projects`}
        >
          View All Projects <ArrowRight />
        </Link>
      </div>
      {/* Things i'v be done */}
      <div className="text-3xl font-bold text-white">
        Things I&rsquo;ve Built
      </div>
      <ProjectCarousel projects={projects} />
    </section>
  );
}
