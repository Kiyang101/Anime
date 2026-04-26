import Image from "next/image";
import Link from "next/link";
import HeroCarousel, { HeroAnime } from "@/components/HeroCarousel";
import ClearSessionLink from "@/components/ClearSessionLink";
import RecommendationRow from "@/components/RecommendationRow";
import useAnimeAPI from "@/service/api";

// Cache the rendered page for 1 hour — API calls happen at most once per hour in production
export const revalidate = 3600;

const {
  getAnimeSeasonNow,
  getAnimeSearch,
  getAnimeSeason,
  getAnimeRecommendations,
  getMangaRecommendations,
} = useAnimeAPI();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getPrevSeason(): { season: string; year: number } {
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  if (month >= 3 && month <= 5) return { season: "winter", year };
  if (month >= 6 && month <= 8) return { season: "spring", year };
  if (month >= 9 && month <= 11) return { season: "summer", year };
  return { season: "fall", year: year - 1 };
}

interface AnimeItem {
  mal_id: number;
  title: string;
  title_english?: string;
  synopsis: string;
  score?: number;
  type?: string;
  status?: string;
  genres: { mal_id: number; name: string }[];
  images: { jpg: { large_image_url: string } };
}

function AnimeCard({
  anime,
  upcoming = false,
}: {
  anime: AnimeItem;
  upcoming?: boolean;
}) {
  return (
    <Link
      href={`/anime/${anime.mal_id}`}
      className="group shrink-0 w-35 bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
    >
      <div className="relative aspect-3/4 w-full overflow-hidden">
        <Image
          src={anime.images.jpg.large_image_url}
          alt={anime.title_english || anime.title}
          fill
          sizes="140px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold">
          {upcoming ? (
            <span className="text-purple-400">Soon</span>
          ) : anime.score ? (
            <span className="text-yellow-400">★ {anime.score}</span>
          ) : null}
        </div>
      </div>
      <div className="p-2">
        <p className="text-xs font-semibold text-gray-300 group-hover:text-white truncate transition-colors">
          {anime.title_english || anime.title}
        </p>
        <p className="text-[10px] text-gray-500 mt-0.5">
          {[anime.type, anime.status].filter(Boolean).join(" · ")}
        </p>
      </div>
    </Link>
  );
}

function ScrollRow({
  title,
  anime,
  href = "/anime",
  upcoming = false,
}: {
  title: string;
  anime: AnimeItem[];
  href?: string;
  upcoming?: boolean;
}) {
  if (anime.length === 0) return null;

  return (
    <section className="px-8 lg:px-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <Link
          href={href}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          View All →
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 custom-scrollbar">
        {anime.map((item) => (
          <AnimeCard key={item.mal_id} anime={item} upcoming={upcoming} />
        ))}
      </div>
    </section>
  );
}

export default async function Home() {
  const { season: prevSeason, year: prevYear } = getPrevSeason();

  // Sequential requests with 400ms gap — Jikan allows 3/sec; sequential is the safest approach.
  // In production this only runs once per hour thanks to `revalidate = 3600`.
  const safe = async (fn: () => Promise<{ data: AnimeItem[] }>) => {
    try {
      return (await fn()).data ?? [];
    } catch {
      return [] as AnimeItem[];
    }
  };

  const nowData = await safe(() => getAnimeSeasonNow(1, true, "tv"));
  await sleep(400);
  const topRated = await safe(() =>
    getAnimeSearch({ orderBy: "score", sort: "desc", page: 1 }),
  );
  await sleep(400);
  const popular = await safe(() =>
    getAnimeSearch({ orderBy: "popularity", sort: "asc", page: 1 }),
  );
  await sleep(400);
  const movies = await safe(() =>
    getAnimeSearch({ type: "movie", orderBy: "score", sort: "desc", page: 1 }),
  );
  await sleep(400);
  const upcoming = await safe(() =>
    getAnimeSearch({ status: "upcoming", page: 1 }),
  );
  await sleep(400);
  const lastSeason = await safe(() =>
    getAnimeSeason(prevSeason, String(prevYear), 1, "tv", true),
  );
  await sleep(400);
  const animeRecs = await (async () => {
    try { return (await getAnimeRecommendations()).slice(0, 12); } catch { return []; }
  })();
  await sleep(400);
  const mangaRecs = await (async () => {
    try { return (await getMangaRecommendations()).slice(0, 12); } catch { return []; }
  })();

  const heroItems: HeroAnime[] = nowData.slice(0, 5).map((a) => ({
    mal_id: a.mal_id,
    title: a.title,
    title_english: a.title_english,
    synopsis: a.synopsis,
    score: a.score,
    type: a.type,
    genres: a.genres,
    images: a.images,
  }));

  const trendingGrid = nowData.slice(0, 6);
  const prevSeasonLabel = `${prevSeason.charAt(0).toUpperCase() + prevSeason.slice(1)} ${prevYear}`;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <HeroCarousel anime={heroItems} />

      <div className="flex flex-col gap-10 py-10">
        {/* Trending grid */}
        {trendingGrid.length > 0 && (
          <section className="px-8 lg:px-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">
                🔥 Trending This Season
              </h2>
              <ClearSessionLink
                href="/anime"
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                View All →
              </ClearSessionLink>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
              {trendingGrid.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
          </section>
        )}

        <ScrollRow
          title="⭐ Top Rated All Time"
          anime={topRated.slice(0, 8)}
          href="/anime?orderBy=score&sort=desc"
        />
        <ScrollRow
          title="🏆 Most Popular"
          anime={popular.slice(0, 8)}
          href="/anime?orderBy=popularity&sort=asc"
        />
        <ScrollRow
          title="🎬 Top Movies"
          anime={movies.slice(0, 8)}
          href="/anime?type=movie&orderBy=score&sort=desc"
        />
        <ScrollRow
          title="📅 Upcoming"
          anime={upcoming.slice(0, 8)}
          href="/anime?status=upcoming"
          upcoming
        />
        <ScrollRow
          title={`📺 Last Season (${prevSeasonLabel})`}
          anime={lastSeason.slice(0, 8)}
          href={`/anime?season=${prevSeason}&year=${prevYear}`}
        />

        <RecommendationRow
          title="💡 Anime Recommendations"
          recs={animeRecs}
          basePath="/anime"
        />
        <RecommendationRow
          title="📖 Manga Recommendations"
          recs={mangaRecs}
          basePath="/manga"
        />

        {/* Explore CTAs */}
        <section className="px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ClearSessionLink
              href="/anime"
              className="group bg-linear-to-br from-blue-950 to-gray-950 border border-blue-800 hover:border-blue-500 rounded-2xl p-7 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <p className="text-blue-400 font-bold text-lg mb-2">
                🔍 Anime Search
              </p>
              <p className="text-gray-500 text-sm mb-5">
                Browse &amp; filter the full database by season, rating, type,
                and more
              </p>
              <span className="inline-block bg-blue-600 group-hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                Explore →
              </span>
            </ClearSessionLink>
            <ClearSessionLink
              href="/characters"
              className="group bg-linear-to-br from-purple-950 to-gray-950 border border-purple-800 hover:border-purple-500 rounded-2xl p-7 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <p className="text-purple-400 font-bold text-lg mb-2">
                👤 Character Search
              </p>
              <p className="text-gray-500 text-sm mb-5">
                Find your favorite characters, voice actors, and more
              </p>
              <span className="inline-block bg-purple-600 group-hover:bg-purple-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                Search →
              </span>
            </ClearSessionLink>
          </div>
        </section>
      </div>
    </div>
  );
}
