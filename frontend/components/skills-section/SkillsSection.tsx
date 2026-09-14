import SkillCategoryCard from "./SkillCategoryCard";
import { SkillCategoriesResponse } from "@/lib/interface/portfolio.interface";
import { Code2, PackageOpen } from "lucide-react";

export default function SkillsSection({
  skillCategories
}: {
  skillCategories: SkillCategoriesResponse[];
}) {
  const hasCategories = skillCategories.length > 0;

  return (
    <section id="skills" className="mx-auto mt-12 max-w-7xl space-y-3 px-6">
      <div className="flex items-center">
        <div className="text-brand-primary flex max-w-7xl items-center gap-2 font-medium">
          <Code2 size={20} />
          Skills
        </div>
      </div>
      <div className="text-3xl font-bold text-white">Technologies I Use</div>

      {hasCategories ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {skillCategories.map((category) => (
            <SkillCategoryCard
              key={category.title}
              title={category.title}
              icon={category.icon}
              color={category.color}
              skills={category.items}
            />
          ))}
        </div>
      ) : (
        <div
          role="status"
          aria-label="No skill categories available"
          className="border-brand-accent/10 bg-brand-card/40 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center"
        >
          <div className="bg-brand-accent/10 text-brand-primary flex size-14 items-center justify-center rounded-full">
            <PackageOpen className="size-7" />
          </div>
          <h3 className="text-md font-medium text-white/80">No skills yet</h3>
          <p className="max-w-sm text-sm leading-relaxed text-neutral-400">
            Skill categories will appear here once they are added. Please check
            back later.
          </p>
        </div>
      )}
    </section>
  );
}
