"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAnimeAPI from "@/service/api";
import Popup, { CharacterPopupData } from "./Popup";

interface Character {
  mal_id: number;
  name: string;
  name_kanji?: string;
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

export default function Page() {
  const router = useRouter();
  const { searchCharacters } = useAnimeAPI();

  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [orderBy, setOrderBy] = useState("favorites");
  const [sort, setSort] = useState("desc");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CharacterResponse | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

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
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [data]);

  useEffect(() => {
    const scrollContainer = document.getElementById("main-scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  const pillClass = (active: boolean) =>
    `px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors cursor-pointer ${
      active
        ? "bg-blue-600 border-blue-500 text-white"
        : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
    }`;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-6 lg:p-10">
      <div id="top-anchor" className="absolute top-0" />

      <div className="mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
          Character Search
        </h1>
      </div>

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

      {data ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-6 gap-y-10">
          {data.data.map((character) => {
            const popupData: CharacterPopupData = {
              mal_id: character.mal_id,
              name: character.name,
              name_kanji: character.name_kanji,
              favorites: character.favorites,
              anime: character.anime,
            };
            return (
              <div
                key={character.mal_id}
                onClick={() => router.push(`/characters/${character.mal_id}`)}
                onMouseEnter={() => setHoveredId(character.mal_id)}
                onMouseLeave={() => setHoveredId(null)}
                className="flex justify-center cursor-pointer"
              >
                <div className="relative flex flex-col items-center w-37.5 group">
                  {hoveredId === character.mal_id && (
                    <Popup data={popupData} />
                  )}
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
            );
          })}
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
    </div>
  );
}
