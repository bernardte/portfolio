import { AuroraText } from "@/components/ui/aurora-text";
import { buttonVariants } from "../ui/button";
import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import CodeWindow from "./CodeWindow";
import { cn } from "@/lib/utils";
import { ProfileResponse } from "@/lib/interface/portfolio.interface";
import { getSocialMediaLink } from "@/lib/utils/getSocialMediaLink";

export default function HeroSection({ profile } : { profile: ProfileResponse }) {
  
  const socialLink = getSocialMediaLink(profile);

  return (
    <section
      id="home"
      className="mx-auto flex max-w-7xl flex-col justify-center gap-12 px-6 pb-12 lg:flex-row lg:items-center lg:justify-between"
    >
      {/* Left Introduction */}
      <div className="mx-auto flex flex-col space-y-5">
        <div className="text-brand-primary flex animate-pulse items-center gap-2 text-sm font-medium">
          <GraduationCap className="size-5" />
          <span>Computer Science Graduate</span>
        </div>
        <div>
          <h2 className="text-5xl font-bold text-wrap text-white md:leading-relaxed">
            Hi&#44; I'm {profile.name}👋
          </h2>
          <h3 className="text-4xl font-semibold text-white">
            I build{" "}
            <AuroraText colors={["#0F172A", "#1D4ED8", "#2563EB", "#38BDF8"]}>
              web applications
            </AuroraText>
          </h3>
        </div>
        <p className="text-md max-w-xl leading-8 tracking-wide text-neutral-400">
          Enthusiastic developer passionate about creating meaningful digital
          solutions that solve real-world problems.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href={`/${profile.slug}/#project`}
            className={cn(
              "px-5 py-2",
              buttonVariants({ variant: "ghost", size: "lg" })
            )}
          >
            View My Work
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href={`mailto:${profile.email}`}
            className={cn(
              "px-5 py-2",
              buttonVariants({ variant: "default", size: "lg" })
            )}
          >
            Contact Me
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {socialLink.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  className: "h-10 w-10",
                  variant: "ghost",
                  size: "icon"
                })}
              >
                <Icon className="size-6" />
              </Link>
            );
          })}
        </div>
      </div>
      {/* Code Window Mockup */}
      <div className="hidden min-w-0 lg:flex lg:flex-1 lg:justify-end">
        <CodeWindow />
      </div>
    </section>
  );
}
