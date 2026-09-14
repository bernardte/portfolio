"use client";

import { ReactNode, useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { useToast } from "@/hook/use-toast";
import type { PortfolioDataResponse } from "@/lib/interface/portfolio.interface";
import { useParams, usePathname } from "next/navigation";
import { fetchPortfolioData } from "@/lib/api/portfolio";

export default function layout({ children }: { children: ReactNode }) {
  const params = useParams<{ slug: string }>();
  const { slug } = params;
  const [portfolio, setPortfolio] = useState<PortfolioDataResponse | null>(
    null
  );
  const { error } = useToast();
  const pathname = usePathname();

    const isAllProjectsPage = pathname?.endsWith("/projects");

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetchPortfolioData(slug);

        if (response) {
          setPortfolio(response);
        }
      } catch (errorMessage: any) {
        error(
          errorMessage instanceof Error ? errorMessage.message : errorMessage
        );
      }
    };

    if (slug) {
      fetchPortfolio();
    }
  }, [slug]);

  return (
    <div>
      {portfolio?.profile && !isAllProjectsPage && (
        <Navbar slug={slug} profile={portfolio.profile} />
      )}
      {children}
      {portfolio?.profile && <Footer profile={portfolio.profile} />}
    </div>
  );
}
