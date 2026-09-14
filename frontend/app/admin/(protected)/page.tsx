import MetricsSummary from "@/components/admin/home/MetricsSummary";
import ProfileInformation from "@/components/admin/home/ProfileInformation";
import ProjectSection from "@/components/admin/home/ProjectSection";
import ResumeInformation from "@/components/admin/home/ResumeInformation";
import SkillSection from "@/components/admin/home/SkillSection";
import SectionFrame from "@/components/admin/share/SectionFrame";
import { Button, buttonVariants } from "@/components/ui/button";
import { serverFetch } from "@/lib/api/server";
import {
  profileCompletionSummary,
  ProfileInformationResponse
} from "@/lib/interface/profile.interface";
import { SkillCategoryResponse } from "@/lib/interface/skill.interface";
import { ArrowUpDown } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import StrengthsCard from "@/components/admin/home/StrengthCard";
import { StrengthsResponse } from "@/lib/interface/strength.interface";
import ContactMessageSection from "@/components/admin/home/ContactMessageSection";
import { ContactMessageResponse } from "@/lib/interface/contact-message.interface";

export default async function AdminHomePage() {
  async function fetchProfile() {
    let profile = null;
    try {
      profile = await serverFetch<ProfileInformationResponse>("/profile");
    } catch (error: any) {
      if (error?.message === "UNAUTHORIZED") {
        redirect("/admin/auth?mode=login");
      }
      throw error;
    }
    return profile;
  }

  async function fetchSkills() {
    let skills = null;
    try {
      skills = await serverFetch<SkillCategoryResponse[]>("/skills");
    } catch (error: any) {
      if (error?.message === "UNAUTHORIZED") {
        redirect("/admin/auth?mode=login");
      }
      throw error;
    }
    return skills;
  }

  async function fetchProfileSummary() {
    let profileSummary;

    try {
      profileSummary =
        await serverFetch<profileCompletionSummary>("/profile/summary");
    } catch (error: any) {
      if (error?.message === "UNAUTHORIZED") {
        redirect("/admin/auth?mode=login");
      }
      throw error;
    }

    return profileSummary;
  }

  async function fetchContactMessage() {
    let contactMessages;

    try {
      contactMessages =
        await serverFetch<ContactMessageResponse[]>("/contact-message");
    } catch (error: any) {
      if (error?.message === "UNAUTHORIZED") {
        redirect("/admin/auth?mode=login");
      }
      throw error;
    }

    return contactMessages;
  }

  const [skills, profile, profileSummary, messages] = await Promise.all([
    fetchSkills(),
    fetchProfile(),
    fetchProfileSummary(),
    fetchContactMessage()
  ]);

  async function fetchStrengths(profileId: string) {
    let strengths: StrengthsResponse[];
    try {
      strengths = await serverFetch<StrengthsResponse[]>(
        `/profiles/${profileId}/strengths`
      );
    } catch (error: any) {
      if (error?.message === "UNAUTHORIZED") {
        redirect("/admin/auth?mode=login");
      }
      throw error;
    }

    return strengths;
  }

  return (
    <div className="space-y-6 px-4 pb-24 sm:px-6 lg:px-0 lg:pb-6">
      {/* 第一行：左侧 Profile (占 2 列) + 右侧 Resume & Metrics (占 1 列) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left - Profile Information */}
        <div className="lg:col-span-2">
          <SectionFrame className="h-full">
            <SectionFrame.Header>
              <SectionFrame.Title>
                <span className="text-xl font-bold">Profile Information</span>
              </SectionFrame.Title>
            </SectionFrame.Header>
            <SectionFrame.Body>
              <ProfileInformation initialProfileData={profile} />
            </SectionFrame.Body>
          </SectionFrame>
        </div>

        {/* Right - Resume & Metrics */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <SectionFrame>
            <SectionFrame.Header>
              <SectionFrame.Title>
                <span className="text-xl font-bold">Resume</span>
              </SectionFrame.Title>
            </SectionFrame.Header>
            <SectionFrame.Body>
              <ResumeInformation
                profileId={profile.id}
                initialFileSize={profile.resumeFileSize}
                initialHasResume={profile.hasResume}
                initialFileName={profile.resumeFileName}
                initialUpdatedAt={profile.resumeUpdatedAt}
              />
            </SectionFrame.Body>
          </SectionFrame>

          <SectionFrame className="flex-1">
            <SectionFrame.Body>
              <MetricsSummary profileSummary={profileSummary} />
            </SectionFrame.Body>
          </SectionFrame>
        </div>
      </div>

      <div className="w-full">
        <SectionFrame>
          <SectionFrame.Header className="flex items-center justify-between">
            <SectionFrame.Title>
              <span className="text-xl font-bold">Contact Messages</span>
            </SectionFrame.Title>
          </SectionFrame.Header>
          <SectionFrame.Body>
            <ContactMessageSection messages={messages ?? []} />
          </SectionFrame.Body>
        </SectionFrame>
      </div>

      {/* 第二行：全宽 Projects 展示 */}
      <div className="w-full">
        <SectionFrame>
          <SectionFrame.Header className="flex items-center justify-between">
            <SectionFrame.Title>
              <span className="text-xl font-bold">Projects</span>
            </SectionFrame.Title>
            <div className="flex items-center gap-3">
              <Link href="/admin/projects">
                <Button
                  variant={"default"}
                  className="flex items-center gap-1.5"
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  Manage Project
                </Button>
              </Link>
            </div>
          </SectionFrame.Header>
          <SectionFrame.Body>
            <ProjectSection isFullList={false} />
          </SectionFrame.Body>
        </SectionFrame>
      </div>

      {/* 第三行：Skill Categories 与 Top Strengths 左右 50% 完美平分 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Skill Categories */}
        <SectionFrame className="flex h-full flex-col">
          <SectionFrame.Header className="flex items-center justify-between">
            <SectionFrame.Title>
              <span className="text-xl font-bold">Skill Categories</span>
            </SectionFrame.Title>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/skills"

                className={buttonVariants({
                  className:
                    "text-muted-foreground flex items-center gap-1.5 text-xs font-medium"
                })}
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                Manage Categories
              </Link>
            </div>
          </SectionFrame.Header>

          <SectionFrame.Body className="flex-1">
            <SkillSection sortedCategories={skills} />
          </SectionFrame.Body>
        </SectionFrame>

        {/* Top Strengths */}
        <StrengthsCard
          initializeStrengthData={(await fetchStrengths(profile.id)) ?? []}
          profileId={profile.id}
        />
      </div>
    </div>
  );
}
