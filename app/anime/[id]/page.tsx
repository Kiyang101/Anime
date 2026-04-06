"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import useAnimeAPI from "@/service/api";

// --- INTERFACES ---
interface AnimeDetails {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  title_synonyms?: string[];
  synopsis: string;
  background?: string;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  episodes?: number;
  status: string;
  rating: string;
  year?: number;
  season?: string;
  source?: string;
  duration?: string;
  broadcast?: { string: string };
  aired?: { string: string };
  trailer?: { embed_url: string | null };
  images: { jpg: { large_image_url: string } };
  genres: { mal_id: number; name: string }[];
  themes: { mal_id: number; name: string }[];
  demographics: { mal_id: number; name: string }[];
  studios: { mal_id: number; name: string }[];
  producers: { mal_id: number; name: string }[];
  licensors: { mal_id: number; name: string }[];
  relations: {
    relation: string;
    entry: { mal_id: number; name: string; type: string }[];
  }[];
  theme: { openings: string[]; endings: string[] };
  external: { name: string; url: string }[];
}

interface CharacterListItem {
  character: {
    mal_id: number;
    name: string;
    images: { jpg: { image_url: string } };
  };
  role: string;
}

interface CharacterFullDetails {
  mal_id: number;
  name: string;
  name_kanji: string;
  about: string;
  images: { jpg: { image_url: string } };
  voices: {
    language: string;
    person: {
      name: string;
      images: { jpg: { image_url: string } };
    };
  }[];
}

// --- MAIN COMPONENT ---
export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { getAnimeById, getAnimeCharacters, getCharacterFullById } =
    useAnimeAPI();

  // State
  const [animeData, setAnimeData] = useState<AnimeDetails | null>(null);
  const [characters, setCharacters] = useState<CharacterListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Character Details
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterFullDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [charLoading, setCharLoading] = useState(false);

  // Fetch Anime & Character List
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both anime details and character list concurrently
        const [animeResult, charactersResult] = await Promise.all([
          getAnimeById(id),
          getAnimeCharacters(id),
        ]);
        setAnimeData(animeResult.data);
        setCharacters(charactersResult.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, getAnimeById, getAnimeCharacters]);

  // Handle Character Card Click
  const handleCharacterClick = async (charId: number) => {
    setIsModalOpen(true);
    setCharLoading(true);
    try {
      const result = await getCharacterFullById(charId);
      setSelectedCharacter(result.data);
    } catch (error) {
      console.error("Failed to fetch character details:", error);
    } finally {
      setCharLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-medium tracking-wide">
            Loading database...
          </p>
        </div>
      </div>
    );
  }

  if (!animeData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        Anime not found.
      </div>
    );
  }

  // Combine categories for tags
  const allTags = [
    ...(animeData.genres || []),
    ...(animeData.themes || []),
    ...(animeData.demographics || []),
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-4 lg:p-8 font-sans selection:bg-blue-500/30 relative">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center cursor-pointer text-gray-400 hover:text-white transition-colors"
        >
          <span className="mr-2">←</span> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ================= LEFT COLUMN: Media & Metadata ================= */}
          <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
            {/* Poster */}
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-gray-800">
              <Image
                className="object-cover"
                src={animeData.images.jpg.large_image_url}
                alt={animeData.title}
                fill
                sizes="(max-width: 1024px) 100vw, 320px"
                priority
              />
            </div>

            {/* Global Stats */}
            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-5 shadow-lg">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-800/50 rounded-lg p-2">
                  <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                    Score
                  </h3>
                  <p className="text-yellow-400 font-bold text-xl">
                    {animeData.score || "N/A"}
                  </p>
                  <p className="text-gray-500 text-[10px]">
                    {animeData.scored_by?.toLocaleString() || 0} users
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2">
                  <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                    Ranked
                  </h3>
                  <p className="text-white font-bold text-xl">
                    #{animeData.rank || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2">
                  <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                    Popularity
                  </h3>
                  <p className="text-white font-bold text-xl">
                    #{animeData.popularity || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2">
                  <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                    Members
                  </h3>
                  <p className="text-white font-bold text-xl">
                    {(animeData.members! / 1000).toFixed(1)}k
                  </p>
                </div>
              </div>
            </div>

            {/* Information List */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-5 text-sm space-y-3">
              <h3 className="text-white font-bold border-b border-gray-800 pb-2 mb-3">
                Information
              </h3>
              <p>
                <span className="text-gray-500 font-semibold mr-2">
                  Episodes:
                </span>{" "}
                {animeData.episodes || "Unknown"}
              </p>
              <p>
                <span className="text-gray-500 font-semibold mr-2">
                  Status:
                </span>{" "}
                {animeData.status}
              </p>
              <p>
                <span className="text-gray-500 font-semibold mr-2">Aired:</span>{" "}
                {animeData.aired?.string}
              </p>
              <p>
                <span className="text-gray-500 font-semibold mr-2">
                  Studios:
                </span>{" "}
                {animeData.studios?.map((s) => s.name).join(", ") ||
                  "None found"}
              </p>
              <p>
                <span className="text-gray-500 font-semibold mr-2">
                  Source:
                </span>{" "}
                {animeData.source}
              </p>
              <p>
                <span className="text-gray-500 font-semibold mr-2">
                  Duration:
                </span>{" "}
                {animeData.duration}
              </p>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Content ================= */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Headers */}
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2 leading-tight">
                {animeData.title_english || animeData.title}
              </h1>
              <h2 className="text-xl text-gray-400 font-medium mb-1">
                {animeData.title}
              </h2>
              {animeData.title_japanese && (
                <h3 className="text-lg text-gray-500">
                  {animeData.title_japanese}
                </h3>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <span
                  key={tag.mal_id}
                  className="px-3 py-1 bg-blue-900/30 text-blue-400 border border-blue-500/30 rounded-full text-xs font-medium tracking-wide"
                >
                  {tag.name}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <div className="bg-gray-900/30 rounded-2xl p-6 border border-gray-800/50">
              <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">
                Synopsis
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-md mb-6">
                {animeData.synopsis || "No synopsis available."}
              </p>

              {animeData.background && (
                <>
                  <h3 className="text-xl font-bold text-white mb-3 mt-8 border-b border-gray-800 pb-2">
                    Background
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm italic">
                    {animeData.background}
                  </p>
                </>
              )}
            </div>

            {/* Trailer Embed */}
            {animeData.trailer?.embed_url && (
              <div className="bg-gray-900/30 rounded-2xl p-6 border border-gray-800/50">
                <h3 className="text-2xl font-bold text-white mb-4">Trailer</h3>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-800 shadow-lg">
                  <iframe
                    src={animeData.trailer.embed_url}
                    title="Anime Trailer"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full absolute top-0 left-0"
                  />
                </div>
              </div>
            )}

            {/* Relations (Prequels, Sequels, Adaptations) */}
            {animeData.relations && animeData.relations.length > 0 && (
              <div className="bg-gray-900/30 rounded-2xl p-6 border border-gray-800/50">
                <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">
                  Related Media
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {animeData.relations.map((relation, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800/40 p-3 rounded-lg border border-gray-700/50"
                    >
                      <span className="text-xs text-blue-400 uppercase font-bold tracking-wider">
                        {relation.relation}
                      </span>
                      <ul className="mt-1 flex flex-col gap-1">
                        {relation.entry.map((entry) => (
                          <li
                            key={entry.mal_id}
                            className="text-sm text-gray-200"
                          >
                            {/* In a real app, this would be a Link to /anime/id or /manga/id */}
                            <span className="hover:text-white cursor-pointer transition-colors">
                              {entry.name}
                            </span>
                            <span className="text-gray-500 text-xs ml-2">
                              ({entry.type})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= CHARACTERS SECTION ================= */}
            {characters.length > 0 && (
              <div className="bg-gray-900/30 rounded-2xl p-6 border border-gray-800/50">
                <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-2">
                  Characters
                </h3>
                {/* Note: Jikan API can return dozens of characters. 
                  You may want to slice this to show only main characters: characters.slice(0, 12).map(...)
                */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {characters.map((charItem, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        handleCharacterClick(charItem.character.mal_id)
                      }
                      className="group cursor-pointer flex flex-col bg-gray-800/30 rounded-lg overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden">
                        <Image
                          src={charItem.character.images.jpg.image_url}
                          alt={charItem.character.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 20vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="text-white text-sm font-bold truncate">
                          {charItem.character.name}
                        </h4>
                        <p className="text-blue-400 text-xs mt-1">
                          {charItem.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= CHARACTER MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm ">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[85vh]  flex flex-col shadow-2xl relative">
            {/* Modal Header / Close Button */}
            <div className="sticky top-0 bg-gray-900/90 backdrop-blur border-b rounded-t-2xl border-gray-800 p-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-white">
                Character Details
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full transition-colors px-3 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-full overflow-y-auto custom-scrollbar">
              {charLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400">Loading character info...</p>
                </div>
              ) : selectedCharacter ? (
                <div className="flex flex-col md:flex-row gap-8 max-h-full">
                  {/* Character Image */}
                  <div className="w-full md:w-[250px] shrink-0 sticky top-0 self-start">
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-lg border border-gray-700">
                      <Image
                        src={selectedCharacter.images.jpg.image_url}
                        alt={selectedCharacter.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Character Info */}
                  <div className="flex-1 ">
                    <h2 className="text-3xl font-bold text-white mb-1">
                      {selectedCharacter.name}
                    </h2>
                    {selectedCharacter.name_kanji && (
                      <h3 className="text-xl text-gray-500 mb-6">
                        {selectedCharacter.name_kanji}
                      </h3>
                    )}

                    <div className="mb-8">
                      <h4 className="text-lg font-bold text-white border-b border-gray-800 pb-2 mb-3">
                        About
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                        {selectedCharacter.about || "No details available."}
                      </p>
                    </div>

                    {/* Voice Actors */}
                    {selectedCharacter.voices &&
                      selectedCharacter.voices.length > 0 && (
                        <div>
                          <h4 className="text-lg font-bold text-white border-b border-gray-800 pb-2 mb-4">
                            Voice Actors
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedCharacter.voices.map((va, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 bg-gray-800/50 p-2 rounded-lg border border-gray-700/50"
                              >
                                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                                  <Image
                                    src={va.person.images.jpg.image_url}
                                    alt={va.person.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-200">
                                    {va.person.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {va.language}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Failed to load character.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
