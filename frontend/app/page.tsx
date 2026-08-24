import AboutMeSection from "@/components/about-me/AboutMeSection";
import ContactSection from "@/components/contact-section/ContactSection";
import HeroSection from "@/components/hero-section/HeroSection";
import MyProjectSection from "@/components/my-project-section/MyProjectSection";
import SkillsSection from "@/components/skills-section/SkillsSection";
export default function page() {
  return (
    <main className="pt-28">
      <HeroSection />
      <div className="group relative mx-auto max-w-7xl">
        {/* Glow 层:比卡片大一圈,模糊后形成光晕,hover 时淡入 */}
        <div
          className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#06B6D4] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
          aria-hidden
        />
        <AboutMeSection />
      </div>
      <MyProjectSection />
      <SkillsSection />
      <ContactSection />
    </main>
  );
}
