// components/skills/SkillCategoryCard.tsx
import { LucideIcon } from "lucide-react";
import SkillCard from "./SkillCard";
import { Skill } from "@/constants/skillsDetail";

interface SkillCategoryCardProps {
  title: string;
  icon: LucideIcon;
  skills: Skill[];
}

export default function SkillCategoryCard({
  title,
  icon: Icon,
  skills
}: SkillCategoryCardProps) {
  return (
    <div className="bg-brand-card flex flex-col gap-4 rounded-xl border border-white/10 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <Icon className="text-brand-accent size-4" />
        <span className="text-sm font-medium text-white">{title}</span>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-4">
        {skills.map((skill) => (
          <SkillCard
            key={skill.name}
            logoUrl={skill.logoUrl}
            name={skill.name}
          />
        ))}
      </div>
    </div>
  );
}
