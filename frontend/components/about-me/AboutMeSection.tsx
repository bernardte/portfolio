import Image from "next/image";
import { LucideProps, User } from "lucide-react";
import { ShineBorder } from "../ui/shine-border";
import { Info_Item } from "@/constants/infoItem";
import { TRAIT_ITEMS } from "@/constants/traitTags";
import { ComponentType } from "react";
import { InfoItem } from "../share/InfoItem";

export default function AboutMeSection() {
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
          <Image
            src={"https://enchanting-azure-txnjdohk.edgeone.dev/file.png"}
            fill
            sizes="(max-width: 768px) 60vw, (max-width: 1280px) 200px, 280px"
            alt="own selfie"
            priority
            className="object-cover"
          />
        </div>

        {/* Right Intro */}
        <div className="flex flex-col justify-center space-y-4">
          {/* Pin About Us */}
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
            I&apos;m a Computer Science graduate with hands-on experience in
            full-stack web development and passionate about building scalable,
            user-friendly applications.
          </p>

          <p className="text-sm leading-relaxed text-neutral-400">
            I enjoy solving problems, learning new technologies, and turning
            ideas into real-world products.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Info_Item.map((info) => (
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
        <div className="bg-brand-accent/10 flex flex-1 flex-col rounded-md shadow-[0_10px_40px_rgba(124,58,237,0.2)] transition-shadow duration-300 group-hover:shadow-none md:col-span-2 xl:col-span-1">
          {TRAIT_ITEMS.map((item) => (
            <TraitTags
              key={item.id}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface TraitItem {
  title: string;
  description: string;
  icon: ComponentType<LucideProps>;
}

function TraitTags({ title, description, icon: Icon }: TraitItem) {
  return (
    <div className="border-muted-foreground/10 flex items-center gap-3 border-b p-4 last:border-0">
      <div className="bg-brand-accent/20 border-brand-accent/10 rounded-full border p-3">
        <Icon className="text-brand-accent size-7" />
      </div>
      <div className="flex flex-col space-y-1">
        <div className="text-md font-medium text-neutral-300 capitalize">
          {title}
        </div>
        <div className="text-muted-foreground text-sm">{description}</div>
      </div>
    </div>
  );
}
