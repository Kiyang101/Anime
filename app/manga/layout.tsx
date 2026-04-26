import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Manga",
  description: "Search and filter manga by genre, type, and more.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
