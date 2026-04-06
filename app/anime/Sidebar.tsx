import { useState, useEffect } from "react";

export default function Sidebar({
  className,
  setSeasons,
  setSearchParams,
  currentSeason,
  currentSearch,
  clearFilters, // Added prop
}: {
  className?: string;
  setSeasons: (season: string, year: string, sfw: boolean) => void;
  setSearchParams: (
    query: string,
    rating: string,
    orderBy: string,
    sort: string,
    startDate: string,
    type: string,
    status: string,
    sfw: boolean,
  ) => void;
  currentSeason: { season: string; year: string; sfw: boolean };
  currentSearch: {
    query: string;
    rating: string;
    orderBy: string;
    sort: string;
    startDate: string;
    type: string;
    status: string;
    sfw: boolean;
  };
  clearFilters: () => void; // Added prop type
}) {
  const [season, setSeason] = useState(currentSeason.season || "");
  const [year, setYear] = useState(currentSeason.year || "");
  const [sfw, setSfw] = useState<boolean>(currentSeason.sfw ?? true);

  const [query, setQuery] = useState(currentSearch.query || "");
  const [rating, setRating] = useState(currentSearch.rating || "");
  const [orderBy, setOrderBy] = useState(currentSearch.orderBy || "");
  const [sort, setSort] = useState(currentSearch.sort || "");
  const [startDate, setStartDate] = useState(currentSearch.startDate || "");
  const [type, setType] = useState(currentSearch.type || "");
  const [status, setStatus] = useState(currentSearch.status || "");
  const [sfwSearch, setSfwSearch] = useState<boolean>(
    currentSearch.sfw ?? true,
  );

  // We use this to force the uncontrolled search form to remount and empty out when cleared
  const [formResetKey, setFormResetKey] = useState(0);

  useEffect(() => {
    setSeason(currentSeason.season || "");
    setYear(currentSeason.year || "");
    setSfw(currentSeason.sfw || true);
  }, [currentSeason]);

  useEffect(() => {
    setQuery(currentSearch.query || "");
    setRating(currentSearch.rating || "");
    setOrderBy(currentSearch.orderBy || "");
    setSort(currentSearch.sort || "");
    setStartDate(currentSearch.startDate || "");
    setType(currentSearch.type || "");
    setStatus(currentSearch.status || "");
    setSfwSearch(currentSearch.sfw || true);
  }, [currentSearch]);

  const handleSubmitSeason = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formYear = formData.get("year") as string;
    const formSeason = formData.get("season") as string;
    const sfw = formData.get("sfwSeason") === "on";

    if (!formYear || !formSeason) {
      alert("Please fill in both fields.");
      return;
    }

    setSeasons(formSeason, formYear, sfw);
  };

  const handleClearSearch = () => {
    clearFilters();
    setFormResetKey((prev) => prev + 1); // Forces the search form to clear its fields
  };

  const handleClearSeason = () => {
    setSeason("");
    setYear("");
    clearFilters();
  };

  const inputStyles =
    "w-full mt-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent block px-3 py-2 transition-all outline-none placeholder-gray-500";
  const labelStyles =
    "block text-xs font-semibold text-gray-400 uppercase tracking-wider";

  // console.log("Rendering Sidebar with currentSeason:", currentSeason);
  // console.log("Rendering Sidebar with currentSearch:", currentSearch);

  return (
    <aside
      className={`fixed left-0 w-64 md:w-72 h-screen overflow-y-auto bg-gray-900 border-r border-gray-800 shadow-2xl custom-scrollbar pb-10 z-40 ${className}`}
    >
      <div className="p-5 flex flex-col gap-8 pb-20">
        {/* --- ADVANCED SEARCH SECTION --- */}
        <section>
          <div className="mb-5 border-b border-gray-800 pb-3">
            <h1 className="text-lg font-bold text-white tracking-wide">
              Anime Search
            </h1>
            <p className="text-xs text-gray-400 mt-1">Filter the database</p>
          </div>

          <form
            key={formResetKey} // Attached key here to allow forced resets
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get("query") as string;
              const rating = formData.get("rating") as string;
              const orderBy = formData.get("orderBy") as string;
              const sort = formData.get("sort") as string;
              const startDate = formData.get("startDate") as string;
              const type = formData.get("type") as string;
              const status = formData.get("status") as string;
              const sfw = formData.get("sfw") === "on";

              setSearchParams(
                query || "",
                rating || "",
                orderBy || "",
                sort || "",
                startDate ? `${startDate}-01-01` : "",
                type || "",
                status || "",
                sfw,
              );
            }}
            className="flex flex-col gap-4"
          >
            {/* ... (All the inputs inside the search form stay exactly the same) ... */}
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
                placeholder="e.g., Naruto, Bleach..."
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
                placeholder="e.g., 2026"
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
                  <option value="tv">TV</option>
                  <option value="movie">Movie</option>
                  <option value="ova">OVA</option>
                  <option value="ona">ONA</option>
                  <option value="special">Special</option>
                  <option value="tv_special">TV Special</option>
                  <option value="music">Music</option>
                  <option value="cm">CM</option>
                  <option value="pv">PV</option>
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
                  <option value="airing">Airing</option>
                  <option value="complete">Complete</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="rating" className={labelStyles}>
                Rating
              </label>
              <select
                name="rating"
                id="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className={inputStyles}
              >
                <option value="">Any Rating</option>
                <option value="g">G - All Ages</option>
                <option value="pg">PG - Children</option>
                <option value="pg13">PG-13 - Teens 13+</option>
                <option value="r17">R - 17+</option>
                <option value="r">R+ - Mild Nudity</option>
                <option value="rx">Rx - Hentai</option>
              </select>
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
                <option value="episodes">Episodes</option>
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

            <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-md border border-gray-700">
              <input
                type="checkbox"
                name="sfw"
                id="sfw"
                checked={sfwSearch}
                onChange={(e) => {
                  setSfwSearch(e.target.checked);
                }}
                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
              />
              <label
                htmlFor="sfw"
                className="text-sm font-medium text-white cursor-pointer select-none"
              >
                Safe For Work (SFW)
              </label>
            </div>

            {/* Split into Apply and Clear Buttons */}
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md transition-colors shadow-lg shadow-blue-500/20 cursor-pointer"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        {/* --- SEASON SEARCH SECTION --- */}
        <section>
          <div className="mb-5 border-b border-gray-800 pb-3">
            <h1 className="text-lg font-bold text-white tracking-wide">
              Seasonal Anime
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Browse by release window
            </p>
          </div>

          <form onSubmit={handleSubmitSeason} className="flex flex-col gap-4">
            <div>
              <label htmlFor="year" className={labelStyles}>
                Year
              </label>
              <input
                type="number"
                name="year"
                id="year"
                placeholder="e.g., 2026"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={inputStyles}
              />
            </div>

            <div>
              <label htmlFor="season" className={labelStyles}>
                Season
              </label>
              <select
                name="season"
                id="season"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className={inputStyles}
              >
                <option value="">Select Season</option>
                <option value="winter">❄️ Winter</option>
                <option value="spring">🌸 Spring</option>
                <option value="summer">☀️ Summer</option>
                <option value="fall">🍂 Fall</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sfwSeason"
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="sfwSeason"
                  id="sfwSeason"
                  checked={sfw}
                  onChange={(e) => {
                    setSfw(e.target.checked);
                  }}
                  className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-sm font-medium text-white">
                  Safe For Work (SFW)
                </span>
              </label>
            </div>

            {/* Split into Search and Clear Buttons */}
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-md transition-colors shadow-lg shadow-purple-500/20 cursor-pointer"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleClearSeason}
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
