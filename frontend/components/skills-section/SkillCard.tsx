// components/skills/SkillCard.tsx
import Image from "next/image";

interface SkillCardProps {
  logoUrl: string;
  name: string;
}

export default function SkillCard({ logoUrl, name }: SkillCardProps) {
  return (
    <div className="group flex flex-col items-center gap-2">
      <div className="flex size-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2 transition-colors group-hover:border-white/20 sm:size-14">
        <Image
          src={logoUrl}
          height={28}
          width={28}
          alt={`${name} logo`}
          className="h-auto w-full object-contain"
        />
      </div>
      <span className="text-xs text-neutral-400 transition-colors group-hover:text-neutral-200">
        {name}
      </span>
    </div>
  );
}
