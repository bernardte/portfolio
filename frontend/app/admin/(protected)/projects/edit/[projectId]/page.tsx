import ProjectForm from "@/components/admin/projects/ProjectForm";
import { serverFetch } from "@/lib/api/server";
import { redirect } from "next/navigation";
import { ProjectsResponseData } from "@/lib/interface/project.interface";
import { ExistingProject } from "@/components/admin/projects/OrderPositionPicker";

interface EditProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function EditProjectPage({
  params
}: EditProjectPageProps) {
  const { projectId } = await params;

  let projects = null;

  try {
    projects = await serverFetch<ProjectsResponseData[]>("/project");
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      redirect("/admin/auth?mode=login");
    }

    throw error;
  }

  const updateProject = projects.find((project) => project.id === projectId);
  const existingProjects: ExistingProject[] = projects
    .filter((project) => project.id !== projectId)
    .map((project) => ({
      id: project.id,
      title: project.projectTitle,
      thumbnailUrl: project.projectThumbnailImage
    }));

  return (
    <div>
      <ProjectForm
        mode="edit"
        existingProjects={existingProjects}
        initialValues={updateProject}
        projectId={projectId}
      />
    </div>
  );
}
