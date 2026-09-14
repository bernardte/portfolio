import { objectToFormData } from "../utils/objectToFromData";
import { apiClient } from "./client";
import {
  ProjectCreateRequestData,
  ProjectUpdateRequestData,
  ProjectsResponseData
} from "../interface/project.interface";

export function createProjectApi(projectData: ProjectCreateRequestData) {
  const formData = objectToFormData(projectData, new FormData(), "");

  return apiClient("/project", {
    method: "POST",
    body: formData
  });
}

export function updateProjectApi(
  projectId: string,
  projectData: ProjectUpdateRequestData
): Promise<ProjectUpdateRequestData> {
  const formData = objectToFormData(projectData, new FormData(), "");

  return apiClient(`/project/${projectId}`, {
    method: "PATCH",
    body: formData
  });
}

export function findAllProjectApi(): Promise<ProjectsResponseData[]> {
  return apiClient("/project", {
    method: "GET"
  });
}

export function reorderProjectApi(
  orderedIds: string[]
): Promise<ProjectsResponseData[]> {
  return apiClient("/project/reorder", {
    method: "PATCH",
    body: JSON.stringify({ orderedIds }),
  });
}

export async function toggleChecked(id: string, visibility: { isPublic: boolean }){
  return apiClient(`/project/${id}/visibility`, {
    method: "PATCH",
    body: JSON.stringify(visibility)
  });
}

export async function removeProject(id: string) {
  return apiClient(`/project/${id}`, {
    method: "DELETE"
  })
}

