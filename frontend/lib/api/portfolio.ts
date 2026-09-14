import { PortfolioDataResponse } from "../interface/portfolio.interface";
import { apiClient } from "./client";

export async function downloadResumeFile(
  slug: string
): Promise<{ resumeDownloadFileUrl: string | null, resumeFileName: string }> {
  return apiClient(`/portfolio/${slug}/resume/download`, {
    method: "GET"
  });
}

export async function fetchPortfolioData(slug: string): Promise<PortfolioDataResponse>{
  return apiClient(`/portfolio/${slug}`, {
    method: "GET"
  });
}