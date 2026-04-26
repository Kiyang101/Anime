"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useAnimeAPI from "@/service/api";

interface Character {
  mal_id: number;
  name: string;
  images: { jpg: { image_url: string } };
  favorites: number;
  anime?: { role: string; anime: { mal_id: number; title: string } }[];
}

interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
}

interface CharacterResponse {
  data: Character[];
  pagination: Pagination;
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
      mal_id: number;
      name: string;
      images: { jpg: { image_url: string } };
    };
  }[];
}

export default function Page() {
  const { searchCharacters, getCharacterFullById } = useAnimeAPI();

  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [orderBy, setOrderBy] = useState("favorites");
  const [sort, setSort] = useState("desc");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CharacterResponse | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterFullDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [charLoading, setCharLoading] = useState(false);

  useEffect(() => {
    if (
      data?.pagination?.has_next_page === false &&
      page > data.pagination.last_visible_page
    ) {
      return;
    }

    const controller = new AbortController();

    setFetchError(false);

    const fetchCharacters = async () => {
      try {
        const response = await searchCharacters({
          query: appliedQuery || undefined,
          orderBy,
          sort,
          page,
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setData(response);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (
            error.name !== "AbortError" &&
            error.name !== "CanceledError" &&
            error.message !== "canceled"
          ) {
            console.error("Error fetching characters:", error);
            if (!controller.signal.aborted) setFetchError(true);
          }
        }
      }
    };

    fetchCharacters();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, orderBy, sort, appliedQuery, retryCount]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;

      switch (event.key) {
        case "ArrowLeft":
          setPage((prev) => Math.max(prev - 1, 1));
          break;
        case "ArrowRight":
          if (data?.pagination?.has_next_page !== false) {
            setPage((prev) => prev + 1);
          }
          break;
        case "Escape":
          if (isModalOpen) closeModal();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [data, isModalOpen]);

  useEffect(() => {
    const scrollContainer = document.getElementById("main-scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  const handleCharacterClick = async (malId: number) => {
    setIsModalOpen(true);
    setCharLoading(true);
    try {
      const result = await getCharacterFullById(String(malId));
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

  const pillClass = (active: boolean) =>
    `px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors cursor-pointer ${
      active
        ? "bg-blue-600 border-blue-500 text-white"
        : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
    }`;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-6 lg:p-10">
      <div id="top-anchor" className="absolute top-0" />

      {/* Heading */}
      <div className="mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
          Character Search
        </h1>
      </div>

      {/* Search row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setAppliedQuery(query);
          setPage(1);
        }}
        className="flex gap-3 mb-6"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Naruto, Levi, Goku..."
          className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-2.5 outline-none placeholder-gray-500"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition-colors shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Order By
          </span>
          <button
            type="button"
            className={pillClass(orderBy === "favorites")}
            onClick={() => {
              setOrderBy("favorites");
              setPage(1);
            }}
          >
            Favorites
          </button>
          <button
            type="button"
            className={pillClass(orderBy === "name")}
            onClick={() => {
              setOrderBy("name");
              setPage(1);
            }}
          >
            Name
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Sort
          </span>
          <button
            type="button"
            className={pillClass(sort === "desc")}
            onClick={() => {
              setSort("desc");
              setPage(1);
            }}
          >
            Desc
          </button>
          <button
            type="button"
            className={pillClass(sort === "asc")}
            onClick={() => {
              setSort("asc");
              setPage(1);
            }}
          >
            Asc
          </button>
        </div>
      </div>

      {/* Character grid */}
      {data ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-6 gap-y-10">
          {data.data.map((character) => (
            <div
              key={character.mal_id}
              onClick={() => handleCharacterClick(character.mal_id)}
              className="flex justify-center cursor-pointer"
            >
              <div className="relative flex flex-col items-center w-37.5 group">
                <div className="relative w-full h-56.25 rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/20 group-hover:shadow-2xl">
                  <Image
                    src={character.images.jpg.image_url}
                    alt={character.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 150px"
                    className="object-cover"
                  />
                </div>
                <h2 className="text-sm font-semibold mt-2 text-center w-full overflow-hidden text-ellipsis whitespace-nowrap text-gray-300 group-hover:text-white transition-colors">
                  {character.name}
                </h2>
                <p className="text-xs text-yellow-400 font-medium mt-0.5">
                  ★ {character.favorites.toLocaleString()}
                </p>
                {character.anime?.[0] && (
                  <Link
                    href={`/anime/${character.anime[0].anime.mal_id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] text-blue-400 hover:text-blue-300 mt-0.5 w-full text-center overflow-hidden text-ellipsis whitespace-nowrap transition-colors"
                  >
                    {character.anime[0].anime.title}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : fetchError ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-400 font-medium">
              Failed to load characters. MyAnimeList may be temporarily
              unavailable.
            </p>
            <button
              type="button"
              onClick={() => {
                setFetchError(false);
                setRetryCount((c) => c + 1);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-medium">Loading characters...</p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination && (
        <div className="flex justify-center items-center gap-2 mt-16 mb-8">
          <button
            type="button"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-800 text-sm font-medium text-gray-300 rounded-lg transition-colors hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage(1)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
              page === 1
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            1
          </button>
          {(page === 1 || page === data.pagination.last_visible_page) &&
          data.pagination.last_visible_page > 2 ? (
            <span className="text-gray-500 px-2">•••</span>
          ) : null}
          {page > 1 && page < data.pagination.last_visible_page && (
            <button
              type="button"
              className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/30"
            >
              {page}
            </button>
          )}
          {data.pagination.last_visible_page > 1 && (
            <button
              type="button"
              onClick={() => setPage(data.pagination.last_visible_page)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                page === data.pagination.last_visible_page
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {data.pagination.last_visible_page}
            </button>
          )}
          <button
            type="button"
            onClick={() => setPage(page + 1)}
            disabled={data.pagination.has_next_page === false}
            className="px-4 py-2 bg-gray-800 text-sm font-medium text-gray-300 rounded-lg transition-colors hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Character detail modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl relative">
            <div className="sticky top-0 bg-gray-900/90 backdrop-blur border-b rounded-t-2xl border-gray-800 p-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-white">
                Character Details
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full transition-colors px-3 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 max-h-full overflow-y-auto custom-scrollbar">
              {charLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400">Loading character info...</p>
                </div>
              ) : selectedCharacter ? (
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-62.5 shrink-0 sticky top-0 self-start">
                    <div className="relative aspect-3/4 w-full rounded-xl overflow-hidden shadow-lg border border-gray-700">
                      <Image
                        src={selectedCharacter.images.jpg.image_url}
                        alt={selectedCharacter.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 250px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
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
                    {selectedCharacter.voices &&
                      selectedCharacter.voices.length > 0 && (
                        <div>
                          <h4 className="text-lg font-bold text-white border-b border-gray-800 pb-2 mb-4">
                            Voice Actors
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedCharacter.voices.map((va) => (
                              <div
                                key={va.person.mal_id}
                                className="flex items-center gap-3 bg-gray-800/50 p-2 rounded-lg border border-gray-700/50"
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
