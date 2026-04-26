import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`https://api.jikan.moe/v4/characters/${id}/full`);
    const json = await res.json();
    const name = json.data?.name || "Character";
    const description = json.data?.about?.slice(0, 160) || `Character details for ${name}.`;
    return { title: name, description };
  } catch {
    return { title: "Character Details" };
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
