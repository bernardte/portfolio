"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NAV_LINK } from "@/constants/navlink";
import { Download, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hook/use-toast";
import { downloadResumeFile } from "@/lib/api/portfolio";
import { ProfileResponse } from "@/lib/interface/portfolio.interface";

export default function Navbar({
  slug,
  profile
}: {
  slug: string;
  profile: ProfileResponse;
}) {
  const [activeHash, setActiveHash] = useState("");
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    const handleScrolled = () => {
      setScrolled(window.scrollY > 90);
    };

    handleScrolled();

    window.addEventListener("scroll", handleScrolled, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrolled);
    };
  }, []);

  // track section and show corresponding link
  useEffect(() => {
    const sections = NAV_LINK.map((link) => {
      if (!link.href || link.href === "#") return null;
      try {
        return document.querySelector(link.href);
      } catch {
        return null;
      }
    }).filter((el): el is Element => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  async function handleDownloadResume(slug: string) {
    try {
      console.log("reached here");
      const resume = await downloadResumeFile(slug);
      const a = document.createElement("a");
      a.href = resume.resumeDownloadFileUrl ?? "";
      a.download = resume.resumeFileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      if (resume.resumeDownloadFileUrl) {
        success("Resume suceessfully download");
      }
    } catch (errorMessage: any) {
      error(
        errorMessage instanceof Error ? errorMessage.message : errorMessage
      );
    }
  }

  return (
    <header
      className={cn(
        "bg-brand-bg fixed top-0 right-0 left-0 z-50 backdrop-blur-md transition-all duration-500 ease-out",
        scrolled
          ? "border border-white/10 bg-white/10 backdrop-blur-md"
          : "border-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3">
          <Link href={`/${slug}`} className="group flex flex-col leading-none">
            <div className="relative shrink-0">
              <Image
                src="/logo.svg"
                alt="Yu Hang Tee Logo"
                width={56}
                height={56}
                className="shadow-brand-accent/20 ring-brand-accent/30 rounded-full shadow-lg ring-2 transition-transform hover:scale-105"
              />
            </div>
          </Link>

          <div className="flex max-w-[80px] flex-col leading-tight">
            <span className="to-brand-accent bg-gradient-to-r from-white bg-clip-text text-sm font-bold text-transparent">
              {profile?.name}
            </span>
          </div>
        </div>
        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINK.map((link) => {
            const isActive = activeHash === link.href;
            return (
              <Link
                href={link.href}
                key={link.label}
                onClick={() => setActiveHash(link.href)}
                className={`text-md after:bg-brand-accent relative font-medium transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:transition-all after:duration-300 ${
                  isActive
                    ? "text-brand-accent after:w-full"
                    : "hover:text-brand-accent text-stone-400 after:w-0 hover:after:w-full"
                } `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        {/* CV */}

        <button
          onClick={() => handleDownloadResume(slug)}
          className="bg-brand-primary hover:bg-brand-accent/90 hidden items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-[0.98] md:flex"
        >
          <Download className="size-4" />
          Download CV
        </button>
        {/* Mobile menu toggle */}
        <button
          className="text-brand-accent relative flex size-10 items-center justify-center md:hidden"
          aria-label="Toggle Menu"
          onClick={() => setOpenMobileDrawer((prev) => !prev)}
        >
          <Menu
            size={22}
            className={`absolute transition-all duration-300 ease-in-out ${
              openMobileDrawer
                ? "scale-75 rotate-180 opacity-0"
                : "scale-100 rotate-0 opacity-100"
            }`}
          />

          <X
            size={22}
            className={`absolute transition-all duration-300 ease-in-out ${
              openMobileDrawer
                ? "scale-100 rotate-0 opacity-100"
                : "scale-75 -rotate-180 opacity-0"
            }`}
          />
        </button>
      </div>
      <MobileMenuDrawer
        openMobileDrawer={openMobileDrawer}
        setOpenMobileDrawer={setOpenMobileDrawer}
        onDownloadResume={() => handleDownloadResume(slug)}
      />
    </header>
  );
}

function MobileMenuDrawer({
  openMobileDrawer,
  setOpenMobileDrawer,
  onDownloadResume,
}: {
  openMobileDrawer: boolean;
  setOpenMobileDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  onDownloadResume: () => void;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 md:hidden",
        openMobileDrawer ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <div className="bg-muted-foreground/10 flex flex-col gap-1 px-6 pt-2 pb-6">
        {NAV_LINK.map((link) => (
          <Link
            href={link.href}
            key={link.label}
            onClick={() => setOpenMobileDrawer((prev) => !prev)}
            className="text-brand-primary hover:text-brand-accent border-brand-accent/30 border-b py-3 text-sm font-medium transition-all duration-200 last:border-0 hover:pl-1"
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={onDownloadResume}
          className="bg-brand-accent hover:bg-brand-accent/90 mt-3 flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold text-white shadow-md transition-all active:scale-[0.98]"
        >
          <Download className="size-4" />
          Download CV
        </button>
      </div>
    </div>
  );
}
