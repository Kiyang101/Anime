"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "./Sidebar";
import useAnimeAPI from "@/service/api";
import Popup from "./Popup";

interface Manga {
  mal_id: number;
  title: string;
  title_english?: string;
  type: string;
  status: string;
  score?: number;
  popularity?: number;
  chapters?: number;
  volumes?: number;
  synopsis?: string;
  genres?: { mal_id: number; name: string }[];
  authors?: { mal_id: number; name: string }[];
  images: {
    jpg: {
      large_image_url: string;
    };
  };
}

interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
}

interface MangaResponse {
  data: Manga[];
  pagination: Pagination;
}

const defaultSearch = {
  query: "",
  type: "",
  status: "",
  orderBy: "",
  sort: "",
  startDate: "",
  sfw: true,
  genres: "",
};

export default function Page() {
  const { getMangaSearch } = useAnimeAPI();
  const [data, setData] = useState<MangaResponse | null>(null);
  const [isRestored, setIsRestored] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParamsState] = useState(defaultSearch);

  useEffect(() => {
    const savedPage = sessionStorage.getItem("manga_page");
    const savedSearch = sessionStorage.getItem("manga_search");
    if (savedPage) setPage(JSON.parse(savedPage));
    if (savedSearch) setSearchParamsState(JSON.parse(savedSearch));
    setIsRestored(true);
  }, []);

  useEffect(() => {
    if (isRestored) {
      sessionStorage.setItem("manga_page", JSON.stringify(page));
      sessionStorage.setItem("manga_search", JSON.stringify(searchParams));
    }
  }, [page, searchParams, isRestored]);

  const setSearchParams = (
    query: string,
    type: string,
    status: string,
    orderBy: string,
    sort: string,
    startDate: string,
    sfw: boolean,
    genres: string,
  ) => {
    setSearchParamsState({ query, type, status, orderBy, sort, startDate, sfw, genres });
    setPage(1);
  };

  const clearFilters = () => {
    setSearchParamsState(defaultSearch);
    setPage(1);
  };

  useEffect(() => {
    const scrollContainer = document.getElementById("main-scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  useEffect(() => {
    if (!isRestored) return;

    if (
      data?.pagination?.has_next_page === false &&
      page > data.pagination.last_visible_page
    ) {
      return;
    }

    const controller = new AbortController();

    const fetchManga = async () => {
      try {
        const response = await getMangaSearch({
          page,
          ...searchParams,
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setData(response);
        }
      } catch (error: any) {
        if (
          error.name !== "AbortError" &&
          error.name !== "CanceledError" &&
          error.message !== "canceled"
        ) {
          console.error("Error in component:", error);
        }
      }
    };

    fetchManga();

    return () => {
      controller.abort();
    };
  }, [page, searchParams, isRestored]);

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

  const getUniqueData = () => {
    if (!data?.data) return [];
    return Array.from(new Map(data.data.map((m) => [m.mal_id, m])).values());
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100 font-sans">
      <Sidebar
        setSearchParams={setSearchParams}
        currentSearch={searchParams}
        clearFilters={clearFilters}
        className={`transform transition-all ease-in-out duration-200 ${
          showSidebar ? "" : "-translate-x-full"
        }`}
      />

      <main
        className={`flex-1 ${showSidebar ? "ml-64" : ""} relative transition-all ease-in-out duration-200`}
      >
        <div id="top-anchor" className="absolute top-0" />

        <button
          type="button"
          onClick={() => setShowSidebar(!showSidebar)}
          className={`${showSidebar ? "ml-10" : "ml-2"} mt-2 fixed z-10 p-2 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md cursor-pointer`}
          aria-label="Toggle Sidebar"
        >
          {showSidebar ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <div className={`p-6 lg:p-10 ${showSidebar ? "ml-0" : "ml-5"}`}>
          <div className="mb-8 border-b border-gray-800 pb-4 mt-5">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
              {searchParams.query
                ? `Search Results: "${searchParams.query}"`
                : "Manga"}
            </h1>
          </div>

          {data ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-6 gap-y-10">
              {getUniqueData().map((manga) => (
                <div key={manga.mal_id} className="flex justify-center">
                  <Link
                    href={`/manga/${manga.mal_id}`}
                    className="relative flex flex-col items-center group w-[180px] text-left bg-transparent border-0 p-0 cursor-pointer"
                  >
                    <div className="relative w-full h-[270px] rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/20 group-hover:shadow-2xl">
                      <Image
                        src={manga.images.jpg.large_image_url}
                        alt={manga.title}
                        loading="eager"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      {manga.type && (
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                          {manga.type}
                        </div>
                      )}
                      {manga.score && (
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-yellow-400 text-[10px] font-bold px-2 py-1 rounded shadow">
                          ★ {manga.score}
                        </div>
                      )}
                    </div>
                    <h2 className="text-sm font-semibold mt-3 text-center w-full overflow-hidden text-ellipsis whitespace-nowrap text-gray-300 group-hover:text-white transition-colors">
                      {manga.title}
                    </h2>
                    <Popup
                      className="invisible opacity-0 group-hover:visible group-hover:opacity-100"
                      data={manga}
                    />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-400 font-medium tracking-wide">
                  Loading manga database...
                </p>
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
                <button type="button" className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/30">
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
      </main>
    </div>
  );
}
