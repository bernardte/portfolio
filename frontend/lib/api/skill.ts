import type {
  CreateSkillCategory,
  CreateSkillItem,
  SkillCategoryResponse,
  SkillItemResponse,
  UpdateSkillCategory,
  UpdateSkillItem
} from "../interface/skill.interface";
import { apiClient } from "./client";

export function createSkillCategory(data: CreateSkillCategory) {
  return apiClient("/skills/categories", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function skillIconUpload(
  file: File,
  category: string
): Promise<{
  icon: string;
  fileId: string;
}> {
  const formData = new FormData();
  formData.append("iconFile", file);

  return apiClient(`/skills/icon/image?category=${category}`, {
    method: "POST",
    body: formData
  });
}

export function reorderCategory(
  orderedIds: string[]
): Promise<SkillCategoryResponse[]> {
  return apiClient("/skills/reorder", {
    method: "PATCH",
    body: JSON.stringify({ orderedIds })
  });
}

export function removeCategory(categoryId: string): Promise<void> {
  return apiClient(`/skills/categories/${categoryId}`, {
    method: "DELETE"
  });
}

export function updateCategory(
  categoryId: string,
  values: UpdateSkillCategory
): Promise<SkillCategoryResponse> {
  return apiClient(`/skills/categories/${categoryId}`, {
    method: "PATCH",
    body: JSON.stringify(values)
  });
}

export function createSkillItem(
  categoryId: string,
  values: CreateSkillItem
): Promise<SkillItemResponse> {
  return apiClient(`/skills/categories/${categoryId}/items`, {
    method: "POST",
    body: JSON.stringify(values)
  });
}

export async function updateSkillItem(
  skillItemId: string,
  values: UpdateSkillItem
): Promise<SkillItemResponse> {
  return apiClient(`/skills/items/${skillItemId}`, {
    method: "PATCH",
    body: JSON.stringify(values)
  });
}

export async function removeSkillIttem(skillItemId: string): Promise<void> {
  return apiClient(`/skills/items/${skillItemId}`, {
    method: "DELETE"
  });
}

export async function reorderSkillItem(sourceCategoryId: string, targetCategoryId: string, orderedIds: string[]){
  return apiClient("/skills/reorder/item", {
    method: "PATCH",
    body: JSON.stringify({
      sourceCategoryId,
      targetCategoryId,
      orderedIds
    })
  });
}
