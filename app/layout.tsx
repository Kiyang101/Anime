import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";

const siteUrl = "https://anime-alpha-drab.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Anime Explorer — Browse Anime, Manga & Characters",
    template: "%s | Anime Explorer",
  },
  description: "Discover and explore thousands of anime series, manga titles, and characters from the MyAnimeList database. Search by genre, season, and more.",
  openGraph: {
    type: "website",
    siteName: "Anime Explorer",
    title: "Anime Explorer — Browse Anime, Manga & Characters",
    description: "Discover and explore thousands of anime series, manga titles, and characters from the MyAnimeList database. Search by genre, season, and more.",
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title: "Anime Explorer — Browse Anime, Manga & Characters",
    description: "Discover and explore thousands of anime series, manga titles, and characters from the MyAnimeList database. Search by genre, season, and more.",
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
