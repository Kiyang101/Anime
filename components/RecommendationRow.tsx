"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface RecEntry {
  mal_id: number;
  title: string;
  images: { jpg: { large_image_url: string } };
}

export interface Recommendation {
  mal_id: string;
  entry: RecEntry[];
  content: string;
  user: { username: string };
}

function RecommendationModal({
  rec,
  basePath,
  onClose,
}: {
  rec: Recommendation;
  basePath: string;
  onClose: () => void;
}) {
  const [a, b] = rec.entry;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          aria-label="Close"
        >
          <svg
            className="w-4 h-4"
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
        </button>

        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-800">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Recommended by{" "}
            <span className="text-blue-400">{rec.user.username}</span>
          </p>
        </div>

        {/* Entries */}
        <div className="grid grid-cols-2 gap-px bg-gray-800">
          {[a, b].map((entry, i) => (
            <div key={entry.mal_id} className="bg-gray-900 flex flex-col">
              <div className="relative w-full aspect-3/4 overflow-hidden">
                <Image
                  src={entry.images.jpg.large_image_url}
                  alt={entry.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 256px"
                  className="object-cover"
                />
                {i === 0 && (
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-semibold text-gray-300">
                    If you liked
                  </div>
                )}
                {i === 1 && (
                  <div className="absolute top-2 left-2 bg-blue-600/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-semibold text-white">
                    Try this
                  </div>
                )}
              </div>
              <div className="p-3 flex flex-col gap-2 flex-1">
                <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
                  {entry.title}
                </p>
                <Link
                  href={`${basePath}/${entry.mal_id}`}
                  className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  onClick={onClose}
                >
                  View page
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendation text */}
        {rec.content && (
          <div className="px-5 py-4 border-t border-gray-800">
            <p className="text-xs text-gray-400 leading-relaxed line-clamp-5">
              &ldquo;{rec.content}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function RecommendationCard({
  rec,
  onClick,
}: {
  rec: Recommendation;
  onClick: () => void;
}) {
  const [a, b] = rec.entry;
  if (!a || !b) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group shrink-0 w-56 bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 text-left cursor-pointer"
    >
      <div className="flex h-32 relative">
        <div className="relative w-1/2 overflow-hidden">
          <Image
            src={a.images.jpg.large_image_url}
            alt={a.title}
            fill
            sizes="112px"
            className="object-cover group-hover:scale-105 transition-transform duration-300 brightness-75"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="bg-black/70 backdrop-blur-sm rounded-full w-7 h-7 flex items-center justify-center text-blue-400 font-bold text-sm shadow">
            →
          </span>
        </div>
        <div className="relative w-1/2 overflow-hidden">
          <Image
            src={b.images.jpg.large_image_url}
            alt={b.title}
            fill
            sizes="112px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
      <div className="p-2.5">
        <p className="text-[10px] text-gray-500 truncate">
          <span className="text-gray-400">{a.title}</span>
          <span className="mx-1">→</span>
          <span className="text-blue-400 group-hover:text-blue-300">
            {b.title}
          </span>
        </p>
        {rec.content && (
          <p className="text-[10px] text-gray-600 mt-1 line-clamp-2 leading-relaxed">
            {rec.content}
          </p>
        )}
        <p className="text-[10px] text-gray-600 mt-1">by {rec.user.username}</p>
      </div>
    </button>
  );
}

export default function RecommendationRow({
  title,
  recs,
  basePath,
}: {
  title: string;
  recs: Recommendation[];
  basePath: string;
}) {
  const [activeRec, setActiveRec] = useState<Recommendation | null>(null);

  if (recs.length === 0) return null;

  return (
    <>
      <section className="px-8 lg:px-12">
        <h2 className="text-lg font-bold text-white mb-4">{title}</h2>
        <div className="flex gap-4 overflow-x-auto pb-3 custom-scrollbar">
          {recs.map((rec) => (
            <RecommendationCard
              key={rec.mal_id}
              rec={rec}
              onClick={() => setActiveRec(rec)}
            />
          ))}
        </div>
      </section>

      {activeRec && (
        <RecommendationModal
          rec={activeRec}
          basePath={basePath}
          onClose={() => setActiveRec(null)}
        />
      )}
    </>
  );
}
