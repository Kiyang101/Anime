import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";

const siteUrl = "https://anime-alpha-drab.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Anime Explorer",
    template: "%s | Anime Explorer",
  },
  description: "Browse and search anime, manga, and characters powered by the MyAnimeList database.",
  openGraph: {
    type: "website",
    siteName: "Anime Explorer",
    title: "Anime Explorer",
    description: "Browse and search anime, manga, and characters powered by the MyAnimeList database.",
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title: "Anime Explorer",
    description: "Browse and search anime, manga, and characters powered by the MyAnimeList database.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="">
        <Navbar />
        <div id="main-scroll-container" className="max-h-[90dvh] h-[90dvh] overflow-y-auto overflow-x-hidden custom-scrollbar">
          {children}
          <Analytics />
        </div>
      </body>
    </html>
  );
}
