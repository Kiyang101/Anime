# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server on localhost:3000
npm run build    # production build
npm run lint     # run ESLint
```

No test suite is configured.

## Architecture

**Anime Explorer** — a Next.js App Router app that browses and searches anime and manga via the [Jikan API](https://jikan.moe/) (unofficial MyAnimeList REST API).

### Data layer

`service/api.ts` exports a `useAnimeAPI()` hook (not a React hook — no internal state, just a factory that returns named fetch functions). All network calls use `axios`. Every call that can be cancelled accepts an `AbortSignal` via an `options` object and forwards it to axios.

API functions:
- `getAnimeSeason(season, year, page, filter, sfw, options)` — seasonal listing
- `getAnimeSeasonNow(page, sfw, filter, options)` — currently airing
- `getAnimeSearch(params)` — full-text + filter search; params include `signal`, `genres` (comma-separated IDs)
- `getAnimeById(id)` — full anime details
- `getAnimeCharacters(id)` — character list for an anime
- `getCharacterFullById(id)` — character detail with voice actors
- `searchCharacters(params)` — character search; params include `query`, `orderBy`, `sort`, `page`, `signal`
- `getMangaSearch(params)` — manga full-text + filter search; params include `signal`, `genres`
- `getMangaById(id)` — full manga details
- `getMangaCharacters(id)` — character list for a manga
- `getAnimeGenres()` — fetches `/v4/genres/anime`; deduplicates by `mal_id`
- `getMangaGenres()` — fetches `/v4/genres/manga`; deduplicates by `mal_id`
- `getAnimeRecommendations()` — fetches `/v4/recommendations/anime`
- `getMangaRecommendations()` — fetches `/v4/recommendations/manga`

The landing page (`app/page.tsx`) calls these sequentially with `await sleep(400)` between requests to stay within Jikan's 3 req/s rate limit. Because `revalidate = 3600`, this only runs once per hour in production.

### Routes

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Landing page — async server component, `revalidate = 3600` |
| `/anime` | `app/anime/page.tsx` | Anime browse/search grid with Sidebar |
| `/anime/[id]` | `app/anime/[id]/page.tsx` | Anime detail page with character modal |
| `/manga` | `app/manga/page.tsx` | Manga browse/search grid with Sidebar |
| `/manga/[id]` | `app/manga/[id]/page.tsx` | Manga detail page |
| `/characters` | `app/characters/page.tsx` | Character search grid with detail modal |

`app/loading.tsx` provides the route-level skeleton (Next.js `loading.tsx` convention) shown while the landing page streams in.

### `/anime` page state management

The browse page is a client component that owns all filter state. State is split into two mutually exclusive modes — **season** (`seasonData`) and **search** (`searchParams`) — switching one clears the other. `searchParams` includes a `genres` field (comma-separated genre IDs string). Both are persisted to `sessionStorage` under keys `anime_page`, `anime_season`, and `anime_search`, and restored on mount via an `isRestored` flag that gates the first fetch.

An `AbortController` is created per fetch effect and cancelled on cleanup to avoid stale responses.

Keyboard shortcuts: `ArrowLeft`/`ArrowRight` paginate (suppressed when an input/textarea is focused).

### `/manga` page state management

Same pattern as `/anime` but simpler — only one search mode (no season mode). State is persisted under `manga_page` and `manga_search`. `searchParams` includes a `genres` field.

### Components

- `components/Navbar.tsx` — sticky top nav, server component
- `components/HeroCarousel.tsx` — auto-advancing hero banner (5 s interval); accepts `HeroAnime[]`. Client component.
- `components/ClearSessionLink.tsx` — thin wrapper around `<Link>` that wipes all three `sessionStorage` keys on click. Use this instead of bare `<Link>` when navigating to `/anime` from outside that page, so stale filter state doesn't persist.
- `components/RecommendationRow.tsx` — client component rendering a horizontal scroll of recommendation pair cards. Clicking a card opens a modal showing both entries with `aspect-4/3` images, recommendation text, and "View page" links. Used on the landing page for both anime and manga recommendations.
- `app/anime/Sidebar.tsx` — fixed left panel with two forms (Advanced Search, Seasonal). Advanced Search includes a collapsible multi-select genre picker (fetches from `getAnimeGenres()` on mount, filterable, open by default). Uses `formResetKey` to force-remount the search form on clear. Client component, no `"use client"` directive — relies on parent.
- `app/manga/Sidebar.tsx` — same as anime sidebar but single-form (no seasonal section). Genre picker fetches from `getMangaGenres()`.
- `app/anime/Popup.tsx` — hover tooltip on anime cards; detects viewport edge to flip left/right. Shows title, metadata, score, genre tags, and synopsis.
- `app/manga/Popup.tsx` — same as anime popup but for manga fields (chapters, volumes, status, authors).

### Image configuration

`next.config.ts` whitelists `myanimelist.net` and `cdn.myanimelist.net` as remote image hosts for `next/image`. Add new hostnames here if the Jikan API starts serving images from elsewhere.

### Styling

Tailwind CSS v4 (PostCSS plugin). Global styles and the custom scrollbar class are in `app/globals.css`. The layout constrains the scrollable area to `90dvh` with the Navbar occupying the remaining `10dvh`.

### Analytics

`@vercel/analytics` is integrated in `app/layout.tsx` via the `<Analytics />` component.
