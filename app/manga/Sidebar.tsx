import { useState, useEffect } from "react";
import useAnimeAPI from "@/service/api";

interface Genre {
  mal_id: number;
  name: string;
}

export default function Sidebar({
  className,
  setSearchParams,
  currentSearch,
  clearFilters,
}: {
  className?: string;
  setSearchParams: (
    query: string,
    type: string,
    status: string,
    orderBy: string,
    sort: string,
    startDate: string,
    sfw: boolean,
    genres: string,
  ) => void;
  currentSearch: {
    query: string;
    type: string;
    status: string;
    orderBy: string;
    sort: string;
    startDate: string;
    sfw: boolean;
    genres: string;
  };
  clearFilters: () => void;
}) {
  const { getMangaGenres } = useAnimeAPI();

  const [query, setQuery] = useState(currentSearch.query || "");
  const [type, setType] = useState(currentSearch.type || "");
  const [status, setStatus] = useState(currentSearch.status || "");
  const [orderBy, setOrderBy] = useState(currentSearch.orderBy || "");
  const [sort, setSort] = useState(currentSearch.sort || "");
  const [startDate, setStartDate] = useState(currentSearch.startDate || "");
  const [sfwSearch, setSfwSearch] = useState<boolean>(currentSearch.sfw ?? true);
  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    currentSearch.genres ? currentSearch.genres.split(",").map(Number) : [],
  );

  const [genreList, setGenreList] = useState<Genre[]>([]);
  const [genreFilter, setGenreFilter] = useState("");
  const [genresExpanded, setGenresExpanded] = useState(true);
  const [formResetKey, setFormResetKey] = useState(0);

  useEffect(() => {
    getMangaGenres().then(setGenreList);
  }, []);

  useEffect(() => {
    setQuery(currentSearch.query || "");
    setType(currentSearch.type || "");
    setStatus(currentSearch.status || "");
    setOrderBy(currentSearch.orderBy || "");
    setSort(currentSearch.sort || "");
    setStartDate(currentSearch.startDate || "");
    setSfwSearch(currentSearch.sfw ?? true);
    setSelectedGenres(
      currentSearch.genres ? currentSearch.genres.split(",").map(Number) : [],
    );
  }, [currentSearch]);

  const handleClear = () => {
    clearFilters();
    setSelectedGenres([]);
    setGenreFilter("");
    setFormResetKey((prev) => prev + 1);
  };

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  const filteredGenres = genreList.filter((g) =>
    g.name.toLowerCase().includes(genreFilter.toLowerCase()),
  );

  const inputStyles =
    "w-full mt-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent block px-3 py-2 transition-all outline-none placeholder-gray-500";
  const labelStyles =
    "block text-xs font-semibold text-gray-400 uppercase tracking-wider";

  return (
    <aside
      className={`fixed left-0 w-64 md:w-72 h-screen overflow-y-auto bg-gray-900 border-r border-gray-800 shadow-2xl custom-scrollbar pb-10 z-40 ${className}`}
    >
      <div className="p-5 flex flex-col gap-8 pb-20">
        <section>
          <div className="mb-5 border-b border-gray-800 pb-3">
            <h1 className="text-lg font-bold text-white tracking-wide">
              Manga Search
            </h1>
            <p className="text-xs text-gray-400 mt-1">Filter the database</p>
          </div>

          <form
            key={formResetKey}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              setSearchParams(
                (formData.get("query") as string) || "",
                (formData.get("type") as string) || "",
                (formData.get("status") as string) || "",
                (formData.get("orderBy") as string) || "",
                (formData.get("sort") as string) || "",
                formData.get("startDate")
                  ? `${formData.get("startDate")}-01-01`
                  : "",
                formData.get("sfw") === "on",
                selectedGenres.join(","),
              );
            }}
            className="flex flex-col gap-4"
          >
            <div>
              <label htmlFor="query" className={labelStyles}>
                Search
              </label>
              <input
                type="text"
                name="query"
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., Berserk, One Piece..."
                className={inputStyles}
              />
            </div>

            <div>
              <label htmlFor="startDate" className={labelStyles}>
                Start Year
              </label>
              <input
                type="number"
                name="startDate"
                id="startDate"
                value={startDate ? startDate.split("-")[0] : ""}
                onChange={(e) => {
                  const y = e.target.value;
                  setStartDate(y ? `${y}-01-01` : "");
                }}
                placeholder="e.g., 2020"
                className={inputStyles}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="type" className={labelStyles}>
                  Type
                </label>
                <select
                  name="type"
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={inputStyles}
                >
                  <option value="">Any</option>
                  <option value="manga">Manga</option>
                  <option value="manhwa">Manhwa</option>
                  <option value="manhua">Manhua</option>
                  <option value="novel">Novel</option>
                  <option value="lightnovel">Light Novel</option>
                  <option value="oneshot">One-shot</option>
                  <option value="doujin">Doujin</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className={labelStyles}>
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputStyles}
                >
                  <option value="">Any</option>
                  <option value="publishing">Publishing</option>
                  <option value="complete">Complete</option>
                  <option value="hiatus">Hiatus</option>
                  <option value="discontinued">Discontinued</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="orderBy" className={labelStyles}>
                Order By
              </label>
              <select
                name="orderBy"
                id="orderBy"
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
                className={inputStyles}
              >
                <option value="">Default</option>
                <option value="title">Title</option>
                <option value="start_date">Start Date</option>
                <option value="score">Score</option>
                <option value="chapters">Chapters</option>
                <option value="volumes">Volumes</option>
                <option value="popularity">Popularity</option>
                <option value="rank">Rank</option>
              </select>
            </div>

            <div>
              <label htmlFor="sort" className={labelStyles}>
                Sort
              </label>
              <select
                name="sort"
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={inputStyles}
              >
                <option value="">Default</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            {/* --- GENRES --- */}
            <div>
              <button
                type="button"
                onClick={() => setGenresExpanded((v) => !v)}
                className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-white transition-colors"
              >
                <span>
                  Genres
                  {selectedGenres.length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] rounded-full font-bold">
                      {selectedGenres.length}
                    </span>
                  )}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${genresExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {genresExpanded && (
                <div className="mt-2 bg-gray-800 border border-gray-700 rounded-md overflow-hidden">
                  <div className="p-2 border-b border-gray-700">
                    <input
                      type="text"
                      value={genreFilter}
                      onChange={(e) => setGenreFilter(e.target.value)}
                      placeholder="Filter genres..."
                      className="w-full bg-gray-700 border border-gray-600 text-white text-xs rounded px-2 py-1.5 outline-none placeholder-gray-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto custom-scrollbar">
                    {filteredGenres.map((genre) => (
                      <label
                        key={genre.mal_id}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedGenres.includes(genre.mal_id)}
                          onChange={() => toggleGenre(genre.mal_id)}
                          className="w-3.5 h-3.5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-xs text-gray-300 select-none">
                          {genre.name}
                        </span>
                      </label>
                    ))}
                    {filteredGenres.length === 0 && (
                      <p className="px-3 py-3 text-xs text-gray-500 text-center">No genres found</p>
                    )}
                  </div>
                  {selectedGenres.length > 0 && (
                    <div className="p-2 border-t border-gray-700">
                      <button
                        type="button"
                        onClick={() => setSelectedGenres([])}
                        className="w-full text-xs text-gray-400 hover:text-white transition-colors text-center"
                      >
                        Clear genres
      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-md border border-gray-700">
              <input
                type="checkbox"
                name="sfw"
                id="sfw"
                checked={sfwSearch}
                onChange={(e) => setSfwSearch(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
              />
              <label
                htmlFor="sfw"
                className="text-sm font-medium text-white cursor-pointer select-none"
              >
                Safe For Work (SFW)
              </label>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition-colors shadow-lg shadow-blue-500/20 cursor-pointer"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          </form>
        </section>
      </div>
    </aside>
  );
}
