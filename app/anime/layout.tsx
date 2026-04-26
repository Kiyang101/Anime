import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Anime",
  description: "Search and filter anime by season, genre, and more.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
