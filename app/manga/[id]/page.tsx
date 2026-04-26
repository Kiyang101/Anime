"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import useAnimeAPI from "@/service/api";

interface MangaDetails {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  synopsis?: string;
  background?: string;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  chapters?: number;
  volumes?: number;
  status: string;
  type: string;
  published?: { string: string };
  images: { jpg: { large_image_url: string } };
  genres: { mal_id: number; name: string }[];
  themes: { mal_id: number; name: string }[];
  demographics: { mal_id: number; name: string }[];
  authors: { mal_id: number; name: string; type: string }[];
  serializations: { mal_id: number; name: string }[];
  external: { name: string; url: string }[];
}

interface MangaCharacter {
  character: {
    mal_id: number;
    name: string;
    images: { jpg: { image_url: string } };
  };
  role: string;
}

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { getMangaById, getMangaCharacters } = useAnimeAPI();

  const [manga, setManga] = useState<MangaDetails | null>(null);
  const [characters, setCharacters] = useState<MangaCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Add a flag to prevent race conditions and memory leaks
    let isMounted = true;

    const fetchData = async () => {
      // 2. Safely extract the ID, handling potential array structures from routers
      const mangaId = Array.isArray(id) ? id[0] : id;
      if (!mangaId) return;

      setIsLoading(true);

      try {
        const [mangaRes, charsRes] = await Promise.all([
          getMangaById(mangaId),
          getMangaCharacters(mangaId),
        ]);

        // 3. Only update state if the component is still mounted and
        // the ID hasn't changed while we were fetching
        if (isMounted) {
          setManga(mangaRes.data);
          setCharacters(charsRes.data ?? []);
        }
      } catch (error) {
        console.error("Error fetching manga details:", error);
        // Optional: Add a setError(error) here to show UI feedback
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // 4. Cleanup function runs when `id` changes or component unmounts
    return () => {
      isMounted = false;
    };
  }, [id]);

  const tagPill = (label: string, key: number | string) => (
    <span
      key={key}
      className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium rounded-full"
    >
      {label}
    </span>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-400 font-medium tracking-wide">
            Loading manga details...
          </p>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400 font-medium">Manga not found.</p>
      </div>
    );
  }

  const allTags = [
    ...(manga.genres ?? []),
    ...(manga.themes ?? []),
    ...(manga.demographics ?? []),
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* Hero */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="relative w-full md:w-56 h-80 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            <Image
              src={manga.images.jpg.large_image_url}
              alt={manga.title}
              fill
              sizes="(max-width: 768px) 100vw, 224px"
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-white mb-1">
              {manga.title}
            </h1>
            {manga.title_english && manga.title_english !== manga.title && (
              <p className="text-lg text-gray-400 mb-1">
                {manga.title_english}
              </p>
            )}
            {manga.title_japanese && (
              <p className="text-base text-gray-500 mb-4">
                {manga.title_japanese}
              </p>
            )}

            {/* Stat pills */}
            <div className="flex flex-wrap gap-3 mb-6">
              {manga.score != null && (
                <div className="flex flex-col items-center bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-2 min-w-[64px]">
                  <span className="text-yellow-400 text-lg font-bold">
                    ★ {manga.score}
                  </span>
                  <span className="text-gray-500 text-[10px] uppercase tracking-wider">
                    Score
                  </span>
                </div>
              )}
              {manga.rank != null && (
                <div className="flex flex-col items-center bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-2 min-w-[64px]">
                  <span className="text-white text-lg font-bold">
                    #{manga.rank}
                  </span>
                  <span className="text-gray-500 text-[10px] uppercase tracking-wider">
                    Rank
                  </span>
                </div>
              )}
              {manga.popularity != null && (
                <div className="flex flex-col items-center bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-2 min-w-[64px]">
                  <span className="text-white text-lg font-bold">
                    #{manga.popularity}
                  </span>
                  <span className="text-gray-500 text-[10px] uppercase tracking-wider">
                    Popularity
                  </span>
                </div>
              )}
              {manga.favorites != null && (
                <div className="flex flex-col items-center bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-2 min-w-[64px]">
                  <span className="text-white text-lg font-bold">
                    {manga.favorites.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-[10px] uppercase tracking-wider">
                    Favorites
                  </span>
                </div>
              )}
            </div>

            {/* Info grid */}
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm mb-6">
              <div>
                <dt className="text-gray-500 text-xs uppercase tracking-wider">
                  Type
                </dt>
                <dd className="text-gray-200 font-medium mt-0.5">
                  {manga.type}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 text-xs uppercase tracking-wider">
                  Status
                </dt>
                <dd className="text-gray-200 font-medium mt-0.5">
                  {manga.status}
                </dd>
              </div>
              {manga.chapters != null && (
                <div>
                  <dt className="text-gray-500 text-xs uppercase tracking-wider">
                    Chapters
                  </dt>
                  <dd className="text-gray-200 font-medium mt-0.5">
                    {manga.chapters}
                  </dd>
                </div>
              )}
              {manga.volumes != null && (
                <div>
                  <dt className="text-gray-500 text-xs uppercase tracking-wider">
                    Volumes
                  </dt>
                  <dd className="text-gray-200 font-medium mt-0.5">
                    {manga.volumes}
                  </dd>
                </div>
              )}
              {manga.published?.string && (
                <div className="col-span-2">
                  <dt className="text-gray-500 text-xs uppercase tracking-wider">
                    Published
                  </dt>
                  <dd className="text-gray-200 font-medium mt-0.5">
                    {manga.published.string}
                  </dd>
                </div>
              )}
              {manga.authors && manga.authors.length > 0 && (
                <div className="col-span-2">
                  <dt className="text-gray-500 text-xs uppercase tracking-wider">
                    Authors
                  </dt>
                  <dd className="text-gray-200 font-medium mt-0.5">
                    {manga.authors.map((a) => a.name).join(", ")}
                  </dd>
                </div>
              )}
              {manga.serializations && manga.serializations.length > 0 && (
                <div className="col-span-2">
                  <dt className="text-gray-500 text-xs uppercase tracking-wider">
                    Serialization
                  </dt>
                  <dd className="text-gray-200 font-medium mt-0.5">
                    {manga.serializations.map((s) => s.name).join(", ")}
                  </dd>
                </div>
              )}
            </dl>

            {/* Genre / theme / demographic tags */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => tagPill(tag.name, tag.mal_id))}
              </div>
            )}
          </div>
        </div>

        {/* Synopsis */}
        {manga.synopsis && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white border-b border-gray-800 pb-3 mb-4">
              Synopsis
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {manga.synopsis}
            </p>
          </section>
        )}

        {/* Background */}
        {manga.background && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white border-b border-gray-800 pb-3 mb-4">
              Background
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {manga.background}
            </p>
          </section>
        )}

        {/* Characters */}
        {characters.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white border-b border-gray-800 pb-3 mb-6">
              Characters
            </h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
              {characters.map(({ character, role }) => (
                <div
                  key={character.mal_id}
                  className="flex flex-col items-center group"
                >
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-gray-800 transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/20 group-hover:shadow-2xl">
                    <Image
                      src={character.images.jpg.image_url}
                      alt={character.name}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs font-semibold text-center mt-2 text-gray-300 group-hover:text-white transition-colors w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {character.name}
                  </p>
                  <p className="text-[10px] text-gray-500 text-center">
                    {role}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* External links */}
        {manga.external && manga.external.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white border-b border-gray-800 pb-3 mb-4">
              External Links
            </h2>
            <div className="flex flex-wrap gap-3">
              {manga.external.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white text-sm rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
