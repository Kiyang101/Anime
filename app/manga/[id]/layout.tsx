import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`https://api.jikan.moe/v4/manga/${id}`);
    const json = await res.json();
    const title = json.data?.title_english || json.data?.title || "Manga";
    const description = json.data?.synopsis?.slice(0, 160) || `Details for ${title}.`;
    return { title, description };
  } catch {
    return { title: "Manga Details" };
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
