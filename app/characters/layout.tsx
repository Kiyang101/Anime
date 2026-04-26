import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Character Search",
  description: "Search and discover anime and manga characters.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
