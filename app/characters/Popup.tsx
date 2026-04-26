"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

export interface CharacterPopupData {
  mal_id: number;
  name: string;
  name_kanji?: string;
  favorites: number;
  anime?: { role: string; anime: { mal_id: number; title: string } }[];
}

export default function Popup({
  className,
  data,
}: {
  className?: string;
  data: CharacterPopupData;
}) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [isLeft, setIsLeft] = useState(false);

  useEffect(() => {
    const checkPosition = () => {
      if (popupRef.current && popupRef.current.parentElement) {
        const parentRect =
          popupRef.current.parentElement.getBoundingClientRect();
        const popupWidth = 250;
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
      className={`${className} z-50 transition-all ease-in-out duration-50 shadow-2xl absolute top-0 ${
        isLeft ? "right-full mr-2" : "left-full ml-2"
      }`}
    >
      <div className="backdrop-blur-xl bg-black/80 rounded-lg text-white max-w-[250px] w-[250px] flex flex-col border border-gray-700 overflow-hidden">
        <div className="px-4 py-4 flex flex-col gap-2">
          <h2 className="text-base font-bold leading-tight">{data.name}</h2>
          {data.name_kanji && (
            <p className="text-xs text-gray-400">{data.name_kanji}</p>
          )}
          <p className="text-sm text-yellow-400 font-bold">
            ★ {data.favorites.toLocaleString()}
          </p>
          {data.anime && data.anime[0] && (
            <p className="text-xs text-gray-400">
              <span className="text-gray-500">From: </span>
              {data.anime[0].anime.title}
              <span className="text-blue-400 ml-1">({data.anime[0].role})</span>
            </p>
          )}
          <Link
            href={`/characters/${data.mal_id}`}
            className="mt-2 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            See full details →
          </Link>
        </div>
      </div>
    </div>
  );
}
