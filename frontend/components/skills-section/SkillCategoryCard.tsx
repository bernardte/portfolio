// components/skills/SkillCategoryCard.tsx
import SkillCard from "./SkillCard";
import { NotionIconDisplay } from "../share/icon-picker/IconPickerPopover";
import { SkillItemResponse } from "@/lib/interface/portfolio.interface";

interface SkillCategoryCardProps {
  title: string;
  icon?: string;
  color?: string;
  skills: SkillItemResponse[];
}

export default function SkillCategoryCard({
  title,
  icon,
  color,
  skills
}: SkillCategoryCardProps) {
  return (
    <div className="bg-brand-card flex flex-col gap-4 rounded-xl border border-white/10 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <NotionIconDisplay icon={icon} color={color} />
        <span className="text-sm font-medium text-white">{title}</span>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-4">
        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            icon={skill.icon ?? ""}
            color={skill.color ?? ""}
            title={skill.title}
          />
        ))}
      </div>
    </div>
  );
}
