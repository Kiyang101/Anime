"use client";
import { useRef, useState, useEffect } from "react";

// 1. Define the interface based on the Jikan API data you provided
export interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  score?: number | null;
  popularity?: number | null;
  season?: string;
  year?: number;
  type?: string;
  episodes?: number | null;
  synopsis?: string;
  genres?: { mal_id: number; name: string }[];
  studios?: { name: string }[];
  images?: { jpg: { large_image_url: string } };
}

export default function Popup({
  className,
  data,
}: {
  className?: string;
  data: Anime;
}) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [isLeft, setIsLeft] = useState(false);

  // 2. Keep your excellent position-checking logic
  useEffect(() => {
    const checkPosition = () => {
      if (popupRef.current && popupRef.current.parentElement) {
        const parentRect =
          popupRef.current.parentElement.getBoundingClientRect();

        const popupWidth = 275;
        const safeMargin = 20;

        if (parentRect.right + popupWidth + safeMargin > window.innerWidth) {
          setIsLeft(true);
        } else {
          setIsLeft(false);
        }
      }
    };

    checkPosition();
    window.addEventListener("resize", checkPosition);
    return () => window.removeEventListener("resize", checkPosition);
  }, []);

  return (
    <div
      ref={popupRef}
      // Kept your duration-50 tweak!
      className={`${className} z-50 transition-all ease-in-out duration-50 shadow-2xl absolute top-0 
        ${isLeft ? "right-full mr-2" : "left-full ml-2"}`}
    >
      {/* 3. The rich UI for the Anime Data */}
      <div className="backdrop-blur-xl bg-black/80 rounded-lg text-white text-shadow-lg max-w-[275px] w-[275px] flex flex-col gap-2 border border-gray-700 overflow-hidden">
        <div className="px-5 py-4 flex flex-col gap-2">
        {/* TITLE */}
        <h2 className="text-lg font-bold leading-tight">
          {data.title_english || data.title}
        </h2>

        {/* METADATA ROW (Season, Year, Format, Episodes) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300 font-semibold">
          {data.season && data.year && (
            <span className="capitalize">
              {data.season} {data.year}
            </span>
          )}
          {data.season && <span>•</span>}
          <span>{data.type || "Unknown"}</span>
          <span>•</span>
          <span>{data.episodes ? `${data.episodes} EPS` : "? EPS"}</span>
        </div>

        {/* RATING / SCORE ROW */}
        <div className="flex items-center gap-2 text-sm text-yellow-400 font-bold">
          <span>★ {data.score ? data.score : "N/A"}</span>
          {data.popularity && (
            <span className="text-xs text-gray-400 font-normal">
              (Pop: #{data.popularity})
            </span>
          )}
        </div>

        {/* GENRES TAGS */}
        {data.genres && data.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {data.genres.slice(0, 3).map((genre) => (
              <span
                key={genre.mal_id}
                className="text-[10px] bg-blue-600/50 px-2 py-0.5 rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}

        {/* SYNOPSIS */}
        <p className="text-xs text-gray-200 mt-2 line-clamp-5 leading-relaxed">
          {data.synopsis ? data.synopsis : "No synopsis available."}
        </p>

        {/* STUDIO */}
        {data.studios && data.studios.length > 0 && (
          <div className="mt-auto pt-3 text-xs text-gray-400 italic text-right">
            Studio: {data.studios[0].name}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
