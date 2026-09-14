import ProjectForm from "@/components/admin/projects/ProjectForm";
import { serverFetch } from "@/lib/api/server";
import { ProjectsResponseData } from "@/lib/interface/project.interface";
import { redirect } from "next/navigation";
import { ExistingProject } from "@/components/admin/projects/OrderPositionPicker";

export default async function CreateProjectPage() {
  let projects = null;

  try {
    projects = await serverFetch<ProjectsResponseData[]>("/project");
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      redirect("/admin/auth?mode=login");
    }

    throw error;
  }

  const existingProjects: ExistingProject[] = projects.map((project) => ({
    id: project.id,
    title: project.projectTitle,
    thumbnailUrl: project.projectThumbnailImage
  }));

  return (
    <div>
      <ProjectForm mode="create" existingProjects={existingProjects} />
    </div>
  );
}
