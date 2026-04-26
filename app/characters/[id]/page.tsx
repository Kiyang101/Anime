"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import useAnimeAPI from "@/service/api";

interface CharacterFull {
  mal_id: number;
  name: string;
  name_kanji: string;
  nicknames: string[];
  favorites: number;
  about: string;
  images: { jpg: { image_url: string } };
  anime: {
    role: string;
    anime: {
      mal_id: number;
      title: string;
      images: { jpg: { large_image_url: string } };
    };
  }[];
  manga: {
    role: string;
    manga: {
      mal_id: number;
      title: string;
      images: { jpg: { large_image_url: string } };
    };
  }[];
  voices: {
    language: string;
    person: {
      mal_id: number;
      name: string;
      images: { jpg: { image_url: string } };
    };
  }[];
}

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { getCharacterFullById } = useAnimeAPI();
  const [character, setCharacter] = useState<CharacterFull | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const result = await getCharacterFullById(String(id));
        setCharacter(result.data);
      } catch (error) {
        console.error("Failed to fetch character:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, getCharacterFullById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-medium tracking-wide">
            Loading character...
          </p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        Character not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 lg:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center cursor-pointer text-gray-400 hover:text-white transition-colors"
        >
          <span className="mr-2">←</span> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
            <div className="relative w-full aspect-3/4 rounded-xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-gray-800">
              <Image
                className="object-cover"
                src={character.images.jpg.image_url}
                alt={character.name}
                fill
                sizes="(max-width: 1024px) 100vw, 320px"
                priority
              />
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 text-center">
              <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                Favorites
              </h3>
              <p className="text-yellow-400 font-bold text-2xl">
                ★ {character.favorites.toLocaleString()}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-1 flex flex-col gap-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2 leading-tight">
                {character.name}
              </h1>
              {character.name_kanji && (
                <h2 className="text-xl text-gray-400 font-medium mb-3">
                  {character.name_kanji}
                </h2>
              )}
              {character.nicknames && character.nicknames.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {character.nicknames.map((nick) => (
                    <span
                      key={nick}
                      className="px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-500/30 rounded-full text-xs font-medium"
                    >
                      {nick}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {character.about && (
              <div className="bg-gray-900/30 rounded-2xl p-6 border border-gray-800/50">
                <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">
                  About
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm">
                  {character.about}
                </p>
              </div>
            )}

            {character.anime && character.anime.length > 0 && (
              <div className="bg-gray-900/30 rounded-2xl p-6 border border-gray-800/50">
                <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">
                  Anime Appearances
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {character.anime.map((entry) => (
                    <Link
                      key={entry.anime.mal_id}
                      href={`/anime/${entry.anime.mal_id}`}
                      className="group flex flex-col bg-gray-800/30 rounded-lg overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
                    >
                      <div className="relative aspect-3/4 w-full overflow-hidden">
                        <Image
                          src={entry.anime.images.jpg.large_image_url}
                          alt={entry.anime.title}
                          fill
                          sizes="(max-width: 768px) 50vw, 20vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="text-white text-xs font-bold truncate">
                          {entry.anime.title}
                        </h4>
                        <p className="text-blue-400 text-[11px] mt-1">
                          {entry.role}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {character.manga && character.manga.length > 0 && (
              <div className="bg-gray-900/30 rounded-2xl p-6 border border-gray-800/50">
                <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">
                  Manga Appearances
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {character.manga.map((entry) => (
                    <Link
                      key={entry.manga.mal_id}
                      href={`/manga/${entry.manga.mal_id}`}
                      className="group flex flex-col bg-gray-800/30 rounded-lg overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
                    >
                      <div className="relative aspect-3/4 w-full overflow-hidden">
                        <Image
                          src={entry.manga.images.jpg.large_image_url}
                          alt={entry.manga.title}
                          fill
                          sizes="(max-width: 768px) 50vw, 20vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="text-white text-xs font-bold truncate">
                          {entry.manga.title}
                        </h4>
                        <p className="text-blue-400 text-[11px] mt-1">
                          {entry.role}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {character.voices && character.voices.length > 0 && (
              <div className="bg-gray-900/30 rounded-2xl p-6 border border-gray-800/50">
                <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">
                  Voice Actors
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {character.voices.map((va) => (
                    <div
                      key={va.person.mal_id}
                      className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg border border-gray-700/50"
                    >
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={va.person.images.jpg.image_url}
                          alt={va.person.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-200">
                          {va.person.name}
                        </p>
                        <p className="text-xs text-gray-500">{va.language}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
