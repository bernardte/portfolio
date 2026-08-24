// constants/skills.ts
import { LucideIcon } from "lucide-react";
import { LayoutFreeform, Server, Database, Wrench } from "lucide-react";

export interface Skill {
  name: string;
  logoUrl: string;
}

export interface SkillCategory {
  title: string;
  icon: LucideIcon;
  skills: Skill[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Frontend",
    icon: LayoutFreeform, // 换成你要用的 lucide icon
    skills: [
      { name: "Next.js", logoUrl: "/logos/nextjs.svg" },
      { name: "React", logoUrl: "/logos/react.svg" },
      { name: "TypeScript", logoUrl: "/logos/typescript.svg" },
      { name: "Tailwind CSS" , logoUrl: "/logos/tailwind.svg" }
    ]
  },
  {
    title: "Backend",
    icon: Server,
    skills: [
      { name: "Node.js", logoUrl: "/logos/nodejs.svg" },
      { name: "Express.js", logoUrl: "/logos/express.svg" },
      { name: "Prisma", logoUrl: "/logos/prisma.svg" },
      { name: "REST API", logoUrl: "/logos/restapi.svg" }
    ]
  },
  {
    title: "Database",
    icon: Database,
    skills: [
      { name: "MongoDB", logoUrl: "/logos/mongodb.svg" },
      { name: "PostgreSQL", logoUrl: "/logos/postgresql.svg" },
      { name: "Firebase", logoUrl: "/logos/firebase.svg" },
      { name: "Supabase", logoUrl: "/logos/supabase.svg" }
    ]
  },
  {
    title: "Tools & Others",
    icon: Wrench,
    skills: [
      { name: "Git", logoUrl: "/logos/git.svg" },
      { name: "Docker", logoUrl: "/logos/docker.svg" },
      { name: "VS Code", logoUrl: "/logos/vscode.svg" },
    ]
  }
];
