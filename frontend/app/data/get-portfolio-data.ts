import { serverFetch } from "@/lib/api/server";
import { PortfolioDataResponse } from "@/lib/interface/portfolio.interface";
import { notFound, redirect } from "next/navigation";

export async function getPortfolioData(slug: string){
  try {
    const portfolioData = await serverFetch<Promise<PortfolioDataResponse>>(
      `/portfolio/${slug}`
    );

    return portfolioData;
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") {
      redirect("/admin/auth?mode=login");
    } else if (
      error?.message === "User profile not found" ||
      error?.status === 404
    ){
      notFound();
    }
      throw error;
  }
}