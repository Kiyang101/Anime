# 🎌 Anime Explorer

Anime Explorer is a modern, responsive, and feature-rich web application built with **Next.js 16** and **Tailwind CSS 4**. It leverages the [Jikan API](https://jikan.moe/) to provide a comprehensive database of anime, manga, and characters, allowing users to discover trending titles, browse by season, and perform advanced searches.

![Anime Explorer](public/next.svg) <!-- Placeholder for actual screenshot if available -->

## 🚀 Features

- **Trending & Popular:** Real-time data on current season trending, top-rated all-time, and most popular anime.
- **Advanced Search:** Filter anime and manga by title, rating, status, type (TV, Movie, OVA, etc.), and release year.
- **Seasonal Browsing:** Explore anime by specific years and seasons (Winter, Spring, Summer, Fall).
- **Character Database:** Search for your favorite characters and view their details.
- **Responsive Design:** A sleek "dark mode" aesthetic that works seamlessly across mobile, tablet, and desktop.
- **Optimized Performance:** Implements Next.js `revalidate` for efficient API caching and reduced latency.
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

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Kiyang101/Anime.git
    cd Anime
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

4.  **Open the application:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```text
├── app/                  # Next.js App Router (pages and layouts)
│   ├── anime/            # Anime search and details
│   ├── characters/       # Character search
│   ├── manga/            # Manga search and details
│   └── globals.css       # Global styles with Tailwind 4
├── components/           # Reusable UI components (Carousel, Navbar, etc.)
├── service/              # API service layer (Axios instance and Jikan hooks)
├── public/               # Static assets
└── tsconfig.json         # TypeScript configuration
```

## ⚙️ Configuration

The project is pre-configured to work with the public Jikan API. No API key is required, but please be aware of Jikan's rate limits (3 requests per second). The application includes a `sleep` mechanism in the main page to stay within these limits during data fetching.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

_Made with ❤️ for the Anime Community._
