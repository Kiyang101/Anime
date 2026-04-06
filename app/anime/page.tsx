"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "./Sidebar";
import useAnimeAPI from "@/service/api";
import Popup from "./Popup";

interface Anime {
  mal_id: number;
  title: string;
  rating: string;
  type: string;
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

interface AnimeResponse {
  data: Anime[];
  pagination: Pagination;
}

export default function Page() {
  const { getAnimeSeason, getAnimeSeasonNow, getAnimeSearch } = useAnimeAPI();
  const [data, setData] = useState<AnimeResponse | null>(null);

  // 1. Add a flag to track when state is restored from sessionStorage
  const [isRestored, setIsRestored] = useState(false);

  const [showSidebar, setShowSidebar] = useState(true);

  const [page, setPage] = useState(1);
  const [seasonData, setSeasonData] = useState({
    season: "",
    year: "",
    sfw: true,
  });

  const [searchParams, setSearchParamsState] = useState({
    query: "",
    rating: "",
    orderBy: "",
    sort: "",
    startDate: "",
    type: "",
    status: "",
    sfw: true,
  });

  // 2. Restore state from sessionStorage on initial mount
  useEffect(() => {
    const savedPage = sessionStorage.getItem("anime_page");
    const savedSeason = sessionStorage.getItem("anime_season");
    const savedSearch = sessionStorage.getItem("anime_search");

    // console.log("Restoring state from sessionStorage:", {
    //   page: JSON.parse(savedPage),
    //   season: JSON.parse(savedSeason),
    //   search: JSON.parse(savedSearch),
    // });

    if (savedPage) setPage(JSON.parse(savedPage));
    if (savedSeason) setSeasonData(JSON.parse(savedSeason));
    if (savedSearch) setSearchParamsState(JSON.parse(savedSearch));

    setIsRestored(true); // Mark as ready to fetch
  }, []);

  // 3. Save state to sessionStorage whenever it changes
  useEffect(() => {
    if (isRestored) {
      sessionStorage.setItem("anime_page", JSON.stringify(page));
      sessionStorage.setItem("anime_season", JSON.stringify(seasonData));
      sessionStorage.setItem("anime_search", JSON.stringify(searchParams));
    }
  }, [page, seasonData, searchParams, isRestored]);

  const getUniqueData = () => {
    if (!data?.data) return [];
    const uniqueData = new Map(data.data.map((anime) => [anime.mal_id, anime]));
    return Array.from(uniqueData.values());
  };

  const setSeasons = (newSeason: string, newYear: string, newSfw: boolean) => {
    setSearchParamsState({
      query: "",
      rating: "",
      orderBy: "",
      sort: "",
      startDate: "",
      type: "",
      status: "",
      sfw: true,
    });
    setSeasonData({ season: newSeason, year: newYear, sfw: newSfw });
    setPage(1);
  };

  const setSearchParams = (
    newQuery: string,
    newRating: string,
    newOrderBy: string,
    newSort: string,
    newStartDate: string,
    newType: string,
    newStatus: string,
    newSfw: boolean,
  ) => {
    setSeasonData({ season: "", year: "", sfw: true });
    setSearchParamsState({
      query: newQuery,
      rating: newRating,
      orderBy: newOrderBy,
      sort: newSort,
      startDate: newStartDate,
      type: newType,
      status: newStatus,
      sfw: newSfw,
    });
    setPage(1);
  };

  const scrollToTop = () => {
    const anchor = document.getElementById("top-anchor");
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    scrollToTop();
  }, [page]);

  useEffect(() => {
    // Prevent fetching before sessionStorage data is loaded
    if (!isRestored) return;

    if (
      data?.pagination?.has_next_page === false &&
      page > data.pagination.last_visible_page
    ) {
      return;
    }

    const controller = new AbortController();

    const fetchAnime = async () => {
      try {
        let response;
        const isSearching = Object.values(searchParams).some(
          (val) => val !== "" && val !== true,
        );

        if (isSearching) {
          response = await getAnimeSearch({
            page,
            ...searchParams,
            signal: controller.signal,
          });
        } else if (!seasonData.season || !seasonData.year) {
          response = await getAnimeSeasonNow(page, true, "tv", {
            signal: controller.signal,
          });
        } else {
          response = await getAnimeSeason(
            seasonData.season,
            seasonData.year,
            page,
            "tv",
            seasonData.sfw,
            { signal: controller.signal },
          );
        }

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

    fetchAnime();

    return () => {
      controller.abort();
    };
  }, [page, seasonData, searchParams, isRestored]); // Added isRestored to dependencies

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA") {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          setPage((prevPage) => Math.max(prevPage - 1, 1));
          break;
        case "ArrowRight":
          if (data?.pagination?.has_next_page !== false) {
            setPage((prevPage) => prevPage + 1);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [data]);

  const getShortRating = (rating: string) => {
    if (rating === "G - All Ages") return "G";
    if (rating === "PG - Children") return "PG";
    if (rating === "PG-13 - Teens 13 or older") return "PG-13";
    if (rating === "R - 17+ (violence & profanity)") return "R";
    if (rating === "R+ - Mild Nudity") return "R+";
    if (rating === "Rx - Hentai") return "Rx";
    return "";
  };

  const clearFilters = () => {
    setSeasonData({ season: "", year: "", sfw: true });
    setSearchParamsState({
      query: "",
      rating: "",
      orderBy: "",
      sort: "",
      startDate: "",
      type: "",
      status: "",
      sfw: true,
    });
    setPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Pass the current state down to hydrate the Sidebar inputs */}

      <Sidebar
        setSeasons={setSeasons}
        setSearchParams={setSearchParams}
        currentSeason={seasonData}
        currentSearch={searchParams}
        clearFilters={clearFilters}
        className={`transform transition-all ease-in-out duration-200 ${showSidebar ? "" : "-translate-x-full"}`} // Example of using showSidebar to toggle visibility
      />

      {/* ml-64 md:ml-72 */}
      <main
        className={`flex-1 ${showSidebar ? "ml-64" : ""} relative transition-all ease-in-out duration-200`}
      >
        <div id="top-anchor" className="absolute top-0" />

        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className={`${showSidebar ? "ml-10" : "ml-2"} mt-2 fixed z-10 p-2 bg-gray-800 hover:bg-gray-700 text-blue-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md cursor-pointer`}
          aria-label="Toggle Sidebar"
        >
          {showSidebar ? (
            // Close (X) Icon
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Filter / Menu Icon
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        <div className={`p-6 lg:p-10 ${showSidebar ? "ml-0" : "ml-5"}`}>
          <div className="mb-8 border-b border-gray-800 pb-4 mt-5">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
              {searchParams.query
                ? `Search Results: "${searchParams.query}"`
                : seasonData.season && seasonData.year
                  ? `${seasonData.season.charAt(0).toUpperCase() + seasonData.season.slice(1)} ${seasonData.year} Anime`
                  : "Currently Airing"}
            </h1>
          </div>

          {data ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-x-6 gap-y-10">
              {getUniqueData().map((anime: Anime) => (
                <div key={anime.mal_id} className="flex justify-center">
                  <Link
                    href={`/anime/${anime.mal_id}`}
                    className="relative flex flex-col items-center group w-[180px]"
                  >
                    <div className="relative w-full h-[270px] rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/20 group-hover:shadow-2xl">
                      <Image
                        src={anime.images.jpg.large_image_url}
                        alt={anime.title}
                        loading="eager"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      {anime.type && (
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                          {anime.type}
                        </div>
                      )}
                      {getShortRating(anime.rating) && (
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                          {getShortRating(anime.rating)}
                        </div>
                      )}
                    </div>
                    <h2 className="text-sm font-semibold mt-3 text-center w-full overflow-hidden text-ellipsis whitespace-nowrap text-gray-300 group-hover:text-white transition-colors">
                      {anime.title}
                    </h2>
                    <Popup
                      className="invisible opacity-0 group-hover:visible group-hover:opacity-100"
                      data={anime}
                    />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-medium">Loading anime...</p>
              </div>
            </div>
          )}

          {data && data.pagination && (
            <div className="flex justify-center items-center gap-2 mt-16 mb-8">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-800 text-sm font-medium text-gray-300 rounded-lg transition-colors hover:bg-gray-700 disabled:opacity-40 disabled:hover:bg-gray-800 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
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
                <button className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                  {page}
                </button>
              )}
              {data.pagination.last_visible_page > 1 && (
                <button
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
