import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: {
    default: "Yu Hang Tee | Software Developer",
    template: "%s | Yu Hang Tee"
  },
  description:
    "Portfolio of Yu Hang Tee, a Computer Science graduate and software developer building modern web applications and digital solutions.",
  keywords: [
    "Yu Hang Tee",
    "Software Developer",
    "Full Stack Developer",
    "Web Developer",
    "Computer Science",
    "Next.js",
    "React",
    "TypeScript",
    "Portfolio"
  ],
  authors: [
    {
      name: "Yu Hang Tee"
    }
  ],
  creator: "Yu Hang Tee",
  // metadataBase: new URL("https://your-domain.com"),
  openGraph: {
    title: "Yu Hang Tee | Software Developer",
    description:
      "Computer Science graduate building modern web applications and digital solutions.",
    type: "website",
    locale: "en_US",
    siteName: "Yu Hang Tee Portfolio"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(
        "scroll-smooth",
        geistMono.variable,
        "font-sans",
        geist.variable
      )}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-[#080d18] font-sans text-white antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
