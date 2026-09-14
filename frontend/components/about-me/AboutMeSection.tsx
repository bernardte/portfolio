import Image from "next/image";
import { User, ImageOff } from "lucide-react";
import { ShineBorder } from "../ui/shine-border";
import { TRAIT_ITEMS } from "@/constants/traitTags";
import { InfoItem } from "../share/InfoItem";
import {
  ProfileResponse,
  StrengthResponse
} from "@/lib/interface/portfolio.interface";
import { getInfoItems } from "@/lib/utils/getInfoItems";
import { NotionIconDisplay } from "../share/icon-picker/IconPickerPopover";
import { NOTION_COLORS } from "@/constants/notionColors";

export default function AboutMeSection({
  profile,
  strengths
}: {
  profile: ProfileResponse;
  strengths: StrengthResponse[];
}) {
  const infoItems = getInfoItems(profile);
  const hasAvatar = Boolean(profile.avatarUrl && profile.avatarUrl.trim());
  const hasStrengths = strengths.length > 0;

  return (
    <section
      id="about"
      className="group bg-brand-accent/5 border-muted-foreground/10 relative mx-4 flex max-w-7xl rounded-2xl border-2 p-4 sm:mx-6 sm:p-6 lg:justify-center lg:p-8"
    >
      <div className="rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <ShineBorder
          shineColor={["#7C3AED", "#A78BFA", "#2563EB", "#06B6D4"]}
        />
      </div>

      <div className="grid w-full grid-cols-1 items-stretch gap-6 md:grid-cols-[200px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-8 xl:grid-cols-[280px_1fr_1fr]">
        {/* Left content — image */}
        <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-xl border border-white/10 md:mx-0 md:max-w-none">
          {hasAvatar ? (
            <Image
              src={profile?.avatarUrl || ""}
              fill
              sizes="(max-width: 768px) 60vw, (max-width: 1280px) 200px, 280px"
              alt="own selfie"
              priority
              className="object-cover"
            />
          ) : (
            <div
              role="img"
              aria-label="No avatar available"
              className="bg-brand-accent/10 text-muted-foreground/60 flex h-full w-full items-center justify-center"
            >
              <ImageOff className="size-10" />
            </div>
          )}
        </div>

        {/* Right Intro */}
        <div
          className={`flex flex-col justify-center space-y-4 ${
            hasStrengths ? "" : "xl:col-span-2"
          }`}
        >
          <div className="flex items-center">
            <span className="text-brand-primary border-brand-primary flex justify-center gap-2 rounded-full border-2 px-2 py-2 text-sm font-medium">
              <User className="size-5" />
              About Me
            </span>
          </div>
          <h1 className="text-lg font-extrabold text-white sm:text-xl">
            Get to know me
          </h1>

          <p className="text-sm leading-relaxed text-neutral-400">
            {profile.bio}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {infoItems.map((info) => (
              <InfoItem
                key={info.label}
                Icon={info.icon}
                label={info.label}
                value={info.value}
              />
            ))}
          </div>
        </div>

        {/* Right Content — traits */}
        {hasStrengths && (
          <div className="bg-brand-accent/10 flex flex-1 flex-col rounded-md shadow-[0_10px_40px_rgba(124,58,237,0.2)] transition-shadow duration-300 group-hover:shadow-none md:col-span-2 xl:col-span-1">
            {strengths.map((item) => (
              <TraitTags
                key={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
                color={item.color}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface TraitItem {
  title: string;
  description: string;
  icon?: string;
  color?: string;
}

function TraitTags({ title, description, icon, color = "none" }: TraitItem) {
  const colorObj =
    NOTION_COLORS.find((c) => c.id === color) || NOTION_COLORS[0];
  const hasAccent = color !== "none";
  const glowColor = hasAccent ? colorObj.swatch : "#7C3AED";

  return (
    <div className="group/trait border-muted-foreground/10 flex items-center gap-4 border-b p-4 transition-colors duration-300 last:border-0 hover:bg-white/[0.02]">
      <div className="relative shrink-0">
        <div
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover/trait:opacity-40"
          style={{ backgroundColor: glowColor }}
        />
        <div
          className="relative flex size-12 items-center justify-center rounded-full border transition-transform duration-300 ease-out group-hover/trait:scale-105"
          style={
            hasAccent
              ? {
                  backgroundColor: `${glowColor}26`,
                  borderColor: `${glowColor}4d`
                }
              : {
                  backgroundColor: "rgba(124,58,237,0.12)",
                  borderColor: "rgba(124,58,237,0.3)"
                }
          }
        >
          <div
            style={{
              color: hasAccent ? glowColor : "#A78BFA"
            }}
          >
            <NotionIconDisplay
              icon={icon}
              color={color}
              className="size-5"
              variant="bare"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-1">
        <div className="text-md font-medium text-neutral-200 capitalize transition-colors duration-300 group-hover/trait:text-white">
          {title}
        </div>
        <div className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
}
