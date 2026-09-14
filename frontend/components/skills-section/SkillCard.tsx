import { NotionIconDisplay } from "../share/icon-picker/IconPickerPopover";
import { NOTION_COLORS } from "@/constants/notionColors";

interface SkillCardProps {
  icon: string;
  color?: string; // NOTION_COLORS 的 id,如 "blue" / "none",不传时按 "none" 处理
  title: string;
}

export default function SkillCard({
  icon,
  color = "none",
  title
}: SkillCardProps) {
  const colorObj =
    NOTION_COLORS.find((c) => c.id === color) || NOTION_COLORS[0];
  const hasAccent = color !== "none";

  return (
    <div className="group flex flex-col items-center gap-2.5">
      <div className="relative transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
        {/* hover 时的柔光晕染,只在有强调色时出现 */}
        {hasAccent && (
          <div
            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-60"
            style={{ backgroundColor: colorObj.swatch }}
          />
        )}

        <div className="relative shadow-sm backdrop-blur-sm transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-black/30">
          <div className="transition-transform duration-300 ease-out group-hover:scale-110">
            <NotionIconDisplay icon={icon} color={color} size="lg" />
          </div>
        </div>
      </div>

      <span className="max-w-[64px] truncate text-xs text-neutral-400 transition-colors duration-300 group-hover:text-neutral-200 sm:max-w-[72px]">
        {title}
      </span>
    </div>
  );
}
