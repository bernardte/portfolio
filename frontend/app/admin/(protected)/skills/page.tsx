import { SkillManagement } from "@/components/admin/skills/SkillManagement";
import { serverFetch } from "@/lib/api/server";
import { SkillCategoryResponse } from "@/lib/interface/skill.interface";
import { redirect } from "next/navigation";

export default async function SkillManagementPage() {
  let data;

  try {
    data = await serverFetch("/skills", {
      method: "GET"
    });

  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      redirect("/admin/auth?mode=login");
    }
  }

  return (
    <div>
      <SkillManagement categoriesData={data as SkillCategoryResponse[] ?? []} />
    </div>
  );
}
