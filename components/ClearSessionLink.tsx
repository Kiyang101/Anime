"use client";
import Link from "next/link";

export default function ClearSessionLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        sessionStorage.removeItem("anime_page");
        sessionStorage.removeItem("anime_season");
        sessionStorage.removeItem("anime_search");
      }}
    >
      {children}
    </Link>
  );
}
