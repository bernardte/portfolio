export interface PostCardItems {
  thumbnailImageUrl: string;
  title: string;
  description: string;
  liveDemoUrl: string;
  githubRepoUrl: string;
  badges: {
    id: number,
    className: string;
    title: string;
  }[];
}

// 统一的 Badge 样式，你可以根据项目实际需求调整 bg、text 或 border
const BADGE_STYLE =
  "bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-xs";

export const POST_CARD_DETAILS: PostCardItems[] = [
  {
    thumbnailImageUrl: "/logo.svg", // 建议替换为实际图片路径
    title: "FeedMe Web Application",
    description:
      "Full-stack food delivery platform with order management, payment integration and real-time updates.",
    liveDemoUrl: "https://your-demo-link.com",
    githubRepoUrl: "https://github.com",
    badges: [
      { id: 1, className: BADGE_STYLE, title: "Next.js" },
      { id: 2, className: BADGE_STYLE, title: "TypeScript" },
      { id: 3, className: BADGE_STYLE, title: "Tailwind CSS" },
      { id: 4, className: BADGE_STYLE, title: "Node.js" }
    ]
  },
  {
    thumbnailImageUrl: "/logo.svg",
    title: "Analytics Dashboard",
    description:
      "Real-time analytics dashboard with data visualization, charts and reporting.",
    liveDemoUrl: "https://your-demo-link.com",
    githubRepoUrl: "https://github.com",
    badges: [
      { id: 1, className: BADGE_STYLE, title: "React" },
      { id: 2, className: BADGE_STYLE, title: "TypeScript" },
      { id: 3, className: BADGE_STYLE, title: "MongoDB" },
      { id: 4, className: BADGE_STYLE, title: "Node.js" }
    ]
  },
  {
    thumbnailImageUrl: "/logo.svg",
    title: "Travel Planner App",
    description:
      "Cross-platform mobile app for travel planning and itinerary management.",
    liveDemoUrl: "https://your-demo-link.com",
    githubRepoUrl: "https://github.com",
    badges: [
      { id: 1, className: BADGE_STYLE, title: "Flutter" },
      { id: 2, className: BADGE_STYLE, title: "Dart" },
      { id: 3, className: BADGE_STYLE, title: "Firebase" },
      { id: 4, className: BADGE_STYLE, title: "Maps API" }
    ]
  },
  {
    thumbnailImageUrl: "/logo.svg",
    title: "Creative Art Website",
    description:
      "Company website showcasing premium doors and hardware products.",
    liveDemoUrl: "https://your-demo-link.com",
    githubRepoUrl: "https://github.com",
    badges: [
      { id: 1, className: BADGE_STYLE, title: "Next.js" },
      { id: 2, className: BADGE_STYLE, title: "Sanity CMS" },
      { id: 3, className: BADGE_STYLE, title: "Tailwind CSS" }
    ]
  }
];
