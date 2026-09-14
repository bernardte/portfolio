import { getPortfolioData } from "@/app/data/get-portfolio-data";
import AllProjectsSection from "@/components/view-all-projects/AllProjectsSection";
export default async function page({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const portfolioData = await getPortfolioData(slug);

  return <AllProjectsSection projects={portfolioData.projects ?? []} slug={slug} />;
}
