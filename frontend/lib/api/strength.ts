import {
  CreateStrengths,
  StrengthsResponse,
  UpdateStrengths
} from "../interface/strength.interface";
import { apiClient } from "./client";

export function fetchStrength(profileId: string): Promise<StrengthsResponse[]> {
  return apiClient(`/profiles/${profileId}/strengths`);
}

export function uploadStrengthIcon(
  profileId: string,
  file: File
): Promise<{ fileId: string; icon: string }> {
  const formData = new FormData();
  formData.append("iconFile", file);

  return apiClient(`/profiles/${profileId}/strengths/upload-icon`, {
    method: "POST",
    body: formData
  });
}

export function createStrength(
  profileId: string,
  values: CreateStrengths
): Promise<StrengthsResponse> {
  return apiClient(`/profiles/${profileId}/strengths`, {
    method: "POST",
    body: JSON.stringify(values)
  });
}

export function updateStrength(
  profileId: string,
  strengthId: string,
  values: UpdateStrengths
): Promise<StrengthsResponse> {
  return apiClient(`/profiles/${profileId}/strengths/${strengthId}`, {
    method: "PATCH",
    body: JSON.stringify(values)
  });
}

export function removeStrength(
  profileId: string,
  strengthId: string
): Promise<void> {
  return apiClient(`/profiles/${profileId}/strengths/${strengthId}`, {
    method: "DELETE"
  });
}

export function reorderStrength(profileId: string, data: string[]): Promise<StrengthsResponse[]> {
  return apiClient(`/profiles/${profileId}/strengths`, {
    method: "PATCH",
    body: JSON.stringify({
      orderedIds: data
    })
  });
}
