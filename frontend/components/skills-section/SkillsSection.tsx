import SkillCategoryCard from "./SkillCategoryCard";
import { SKILL_CATEGORIES } from "@/constants/skillsDetail";
import { Code2 } from "lucide-react";

export default function SkillsSection() {
  return (
    <section id="skills" className="mx-auto mt-12 max-w-7xl space-y-3 px-6">
      <div className="flex items-center">
        <div className="text-brand-primary flex max-w-7xl items-center gap-2 font-medium">
          <Code2 size={20} />
          Skills
        </div>
      </div>
      <div className="text-3xl font-bold text-white">Technologies I Use</div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SKILL_CATEGORIES.map((category) => (
          <SkillCategoryCard
            key={category.title}
            title={category.title}
            icon={category.icon}
            skills={category.skills}
          />
        ))}
      </div>
    </section>
  );
}
