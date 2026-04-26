# 🎌 Anime Explorer

Anime Explorer is a modern, responsive, and feature-rich web application built with **Next.js 16** and **Tailwind CSS 4**. It leverages the [Jikan API](https://jikan.moe/) to provide a comprehensive database of anime, manga, and characters, allowing users to discover trending titles, browse by season, perform advanced searches, and explore community recommendations.

## 🚀 Features

- **Trending & Popular:** Real-time data on current season trending, top-rated all-time, and most popular anime.
- **Advanced Search:** Filter anime and manga by title, rating, status, type, release year, and multiple genres simultaneously.
- **Genre Filter:** Multi-select genre picker with live search, loaded from the Jikan genres API.
- **Seasonal Browsing:** Explore anime by specific years and seasons (Winter, Spring, Summer, Fall).
- **Manga Database:** Browse and search the full manga catalog with its own sidebar and detail pages.
- **Recommendations:** Community-sourced anime and manga recommendation pairs on the landing page, with a detail modal and direct links to each title.
- **Character Database:** Search for your favorite characters and view their details.
- **Hover Popups:** Rich info cards appear on hover for every anime and manga card.
- **Responsive Design:** A sleek dark-mode aesthetic that works seamlessly across mobile, tablet, and desktop.
- **Optimized Performance:** Next.js `revalidate` for efficient API caching; `AbortController` per fetch to prevent stale responses.
- **SFW Mode:** Built-in Safe For Work (SFW) filters for a safe browsing experience.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **API:** [Jikan API V4](https://api.jikan.moe/v4/) (Unofficial MyAnimeList API)
- **Analytics:** [@vercel/analytics](https://vercel.com/docs/analytics)

## 📦 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Kiyang101/Anime.git
   cd Anime
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```text
├── app/                  # Next.js App Router (pages and layouts)
│   ├── anime/            # Anime browse/search, Sidebar, Popup
│   ├── anime/[id]/       # Anime detail page with character modal
│   ├── characters/       # Character search
│   ├── manga/            # Manga browse/search, Sidebar, Popup
│   ├── manga/[id]/       # Manga detail page
│   └── globals.css       # Global styles with Tailwind 4
├── components/           # Reusable UI components
│   ├── HeroCarousel.tsx  # Auto-advancing hero banner
│   ├── Navbar.tsx        # Sticky top navigation
│   ├── ClearSessionLink.tsx  # Link that clears sessionStorage filter state
│   └── RecommendationRow.tsx # Recommendation cards + detail modal (client)
├── service/              # API service layer (Axios + Jikan)
│   └── api.ts            # useAnimeAPI() factory with all fetch functions
├── public/               # Static assets
└── tsconfig.json         # TypeScript configuration
```

## ⚙️ Configuration

The project is pre-configured to work with the public Jikan API. No API key is required, but please be aware of Jikan's rate limits (3 requests per second). The landing page uses a `sleep(400ms)` between sequential requests and `revalidate = 3600` so the rate-limited fetch only runs once per hour in production.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

_Made with ❤️ for the Anime Community._
