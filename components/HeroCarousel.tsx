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
  episodes?: number;
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
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anime.length]);

  if (anime.length === 0) return null;

  const current = anime[currentIndex];
  const displayTitle = current.title_english || current.title;
  const subtitle = current.title_english ? current.title : null;

  const goTo = (i: number) => {
    setCurrentIndex(i);
    startTimer();
  };

  return (
    <div className="relative w-full h-[90dvh] overflow-hidden bg-gray-950">
      {/* Image — right side only, left edge blends over 12.5% via mask */}
      <div className="hero-image-mask absolute right-0 top-0 h-full w-[70%]">
        {/* Blurred backdrop fills the area without pixelation */}
        <Image
          src={current.images.jpg.large_image_url}
          alt=""
          fill
          className="object-cover scale-110 blur-sm opacity-60"
          sizes="50vw"
          priority
        />
        {/* Crisp portrait centered on top */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-full w-auto aspect-3/4 max-w-[55%] drop-shadow-2xl">
            <Image
              src={current.images.jpg.large_image_url}
              alt={displayTitle}
              fill
              className="object-cover rounded-sm"
              sizes="30vw"
              priority
            />
          </div>
        </div>
      </div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-gray-950/80 to-transparent" />
      {/* Top vignette */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-linear-to-b from-gray-950/20 to-transparent" />

      {/* Prev arrow */}
      <button
        type="button"
        onClick={() => goTo((currentIndex - 1 + anime.length) % anime.length)}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center text-white/80 text-2xl border border-white/15 bg-white/7 backdrop-blur-md hover:bg-white/15 transition-colors cursor-pointer"
        aria-label="Previous slide"
      >
        ‹
      </button>

      {/* Next arrow */}
      <button
        type="button"
        onClick={() => goTo((currentIndex + 1) % anime.length)}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center text-white/80 text-2xl border border-white/15 bg-white/7 backdrop-blur-md hover:bg-white/15 transition-colors cursor-pointer"
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Slide counter — top right */}
      <div className="absolute top-6 right-16 z-20 text-white/30 text-xs font-semibold tracking-widest">
        {String(currentIndex + 1).padStart(2, "0")} /{" "}
        {String(anime.length).padStart(2, "0")}
      </div>

      {/* Content — anchored bottom-left */}
      <div className="absolute bottom-0 left-0 z-10 flex flex-col justify-end pb-14 pl-14 max-w-[50%]">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-[10px] font-black tracking-[2.5px] uppercase px-3.5 py-1.5 rounded mb-4 w-fit">
          ▶ Airing Now
        </span>

        {/* Genre pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {current.genres.slice(0, 3).map((g) => (
            <span
              key={g.mal_id}
              className="bg-white/6 border border-white/16 text-violet-300 text-[11px] px-3.5 py-1 rounded-full"
            >
              {g.name}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-white font-black leading-[1.05] mb-2 drop-shadow-2xl text-[clamp(36px,5vw,64px)] tracking-[-0.5px]">
          {displayTitle}
        </h1>

        {/* Japanese / original subtitle */}
        {subtitle && (
          <p className="text-violet-500 text-sm tracking-[4px] mb-4 [text-shadow:0_0_24px_rgba(109,28,217,0.6)]">
            {subtitle}
          </p>
        )}

        {/* Score + metadata */}
        <div className="flex items-center gap-2.5 mb-4">
          {current.score && (
            <span className="text-amber-400 text-[15px] font-black">
              ★ {current.score}
            </span>
          )}
          {current.score && (current.type || current.episodes) && (
            <span className="text-white/20 text-sm">·</span>
          )}
          {current.type && (
            <span className="bg-white/7 border border-white/12 text-gray-400 text-[10px] px-2.5 py-1 rounded">
              {current.type}
            </span>
          )}
          {current.episodes && (
            <span className="bg-white/7 border border-white/12 text-gray-400 text-[10px] px-2.5 py-1 rounded">
              {current.episodes} eps
            </span>
          )}
        </div>

        {/* Synopsis */}
        <p className="text-gray-400 text-[13px] leading-[1.8] mb-7 line-clamp-3 max-w-120">
          {current.synopsis}
        </p>

        {/* CTAs */}
        <div className="flex gap-3">
          <Link
            href="/anime"
            className="bg-linear-to-r from-blue-500 to-blue-600 text-white text-[13px] font-bold px-7 py-3.5 rounded-lg shadow-lg shadow-blue-600/40 hover:from-blue-400 hover:to-blue-500 transition-all"
          >
            Explore Anime →
          </Link>
          <Link
            href="/characters"
            className="bg-white/7 border border-white/18 text-gray-300 text-[13px] px-5 py-3.5 rounded-lg backdrop-blur-md hover:bg-white/12 transition-colors"
          >
            Character Search
          </Link>
        </div>
      </div>

      {/* Dot indicators — bottom-left aligned with content */}
      <div className="absolute bottom-5 left-14 z-20 flex items-center gap-1.5">
        {anime.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className={`h-[3px] rounded-full transition-all duration-300 cursor-pointer ${
              i === currentIndex
                ? "w-7 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.7)]"
                : "w-2 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
