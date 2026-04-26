"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export interface HeroAnime {
  mal_id: number;
  title: string;
  title_english?: string;
  synopsis: string;
  score?: number;
  type?: string;
  genres: { mal_id: number; name: string }[];
  images: { jpg: { large_image_url: string } };
}

export default function HeroCarousel({ anime }: { anime: HeroAnime[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % anime.length);
    }, 5000);
  };

  useEffect(() => {
    if (anime.length === 0) return;
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anime.length]);

  if (anime.length === 0) return null;

  const current = anime[currentIndex];

  return (
    <div className="relative h-[420px] bg-gray-950 overflow-hidden">
      {/* Blurred background */}
      <div className="absolute inset-0">
        <Image
          src={current.images.jpg.large_image_url}
          alt=""
          fill
          className="object-cover opacity-20 blur-sm scale-110"
          sizes="100vw"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-gray-950/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-between px-12 lg:px-16 gap-8">
        {/* Left: text */}
        <div className="flex-1 max-w-lg">
          <span className="inline-block bg-blue-600 text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded mb-4">
            ▶ AIRING NOW
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3 line-clamp-2">
            {current.title_english || current.title}
          </h1>
          <div className="flex flex-wrap gap-2 mb-3">
            {current.type && (
              <span className="bg-gray-800/80 border border-gray-700 text-gray-400 text-[10px] px-2 py-0.5 rounded">
                {current.type}
              </span>
            )}
            {current.score && (
              <span className="bg-gray-800/80 border border-gray-700 text-yellow-400 text-[10px] px-2 py-0.5 rounded font-bold">
                ★ {current.score}
              </span>
            )}
            {current.genres.slice(0, 3).map((g) => (
              <span
                key={g.mal_id}
                className="bg-gray-800/80 border border-gray-700 text-gray-400 text-[10px] px-2 py-0.5 rounded"
              >
                {g.name}
              </span>
            ))}
          </div>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6">
            {current.synopsis}
          </p>
          <div className="flex gap-3">
            <Link
              href="/anime"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
            >
              Explore Anime →
            </Link>
            <Link
              href="/characters"
              className="bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm px-5 py-2.5 rounded-lg transition-colors"
            >
              Character Search
            </Link>
          </div>
        </div>

        {/* Right: poster */}
        <div className="hidden lg:block relative w-[180px] h-[260px] rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-gray-700/50 flex-shrink-0">
          <Image
            src={current.images.jpg.large_image_url}
            alt={current.title}
            fill
            className="object-cover"
            sizes="180px"
          />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-12 lg:left-16 z-10 flex gap-2">
        {anime.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { setCurrentIndex(i); startTimer(); }}
            className={`h-[3px] rounded-full transition-all duration-300 cursor-pointer ${
              i === currentIndex ? "w-6 bg-blue-500" : "w-2 bg-gray-600 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
