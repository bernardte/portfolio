import ProjectSection from "@/components/admin/home/ProjectSection";
import SectionFrame from "@/components/admin/share/SectionFrame";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AdminProjectsPage() {
  return (
    <div className="px-4 pb-24 sm:px-6 lg:px-0 lg:pb-6">
      <SectionFrame>
        <SectionFrame.Header>
          <div className="">
            <h1 className="text-2xl font-bold text-gray-900">All Projects</h1>

            <p className="mt-1 text-xs text-gray-500">
              Manage and reorder all your portfolio projects.
            </p>
          </div>
          <Link href={"/admin/projects/create"}>
            <Button>
              <Plus size={15} />
              Add New Project
            </Button>
          </Link>
        </SectionFrame.Header>
        <SectionFrame.Body>
          <ProjectSection isFullList={true} />
        </SectionFrame.Body>
      </SectionFrame>
    </div>
  );
}
