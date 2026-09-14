import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { getSocialMediaLink } from "@/lib/utils/getSocialMediaLink";
import { ProfileResponse } from "@/lib/interface/portfolio.interface";

export default function Footer({ profile }: { profile: ProfileResponse }) {
  const currentYear = new Date().getFullYear();
  const socialMediaLink = getSocialMediaLink(profile);

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-white/5 backdrop-blur-sm">
      {/* 渐变装饰条（位于顶部） */}
      <div className="via-brand-accent/60 absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent to-transparent" />

      <div className="container mx-auto px-4 py-8">
        <div className="mx-10 flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-4">
          {/* 左侧：Logo + 品牌信息 */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <Image
                src="/logo.svg"
                alt="Yu Hang Tee Logo"
                width={56}
                height={56}
                className="shadow-brand-accent/20 ring-brand-accent/30 rounded-full shadow-lg ring-2 transition-transform hover:scale-105"
              />
            </div>
            <div>
              <span className="to-brand-accent bg-gradient-to-r from-white bg-clip-text text-xl font-bold text-transparent">
                Yu Hang Tee
              </span>
              <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-sm">
                <span className="text-brand-accent">✦</span>
                Building digital solutions with passion & high-quality code
              </p>
            </div>
          </div>

          {/* 右侧：社交链接 + 版权 + 回到顶部 */}
          <div className="flex flex-col items-center gap-3 md:items-end">
            {/* 社交图标组 */}
            <div className="flex gap-3">
              {socialMediaLink.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className={buttonVariants({
                      className:
                        "text-muted-foreground hover:border-brand-accent/50 hover:bg-brand-accent/10 hover:text-brand-accent hover:shadow-brand-accent/20 h-11 w-11 rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                      variant: "ghost",
                      size: "icon"
                    })}
                  >
                    <Icon className="size-5" />
                  </Link>
                );
              })}
            </div>

            {/* 版权 + 回到顶部 */}
            <div className="text-muted-foreground flex items-center gap-4 text-xs">
              <span>
                &copy; {currentYear} {profile.name}. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
