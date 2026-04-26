export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-[420px] bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center px-12 lg:px-16 gap-8">
          <div className="flex-1 max-w-lg space-y-4">
            <div className="h-5 w-24 bg-gray-800 rounded" />
            <div className="h-10 w-3/4 bg-gray-800 rounded" />
            <div className="h-8 w-1/2 bg-gray-800 rounded" />
            <div className="flex gap-2">
              <div className="h-4 w-12 bg-gray-800 rounded" />
              <div className="h-4 w-16 bg-gray-800 rounded" />
              <div className="h-4 w-14 bg-gray-800 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-800 rounded" />
              <div className="h-3 w-5/6 bg-gray-800 rounded" />
            </div>
            <div className="flex gap-3 pt-2">
              <div className="h-10 w-36 bg-gray-800 rounded-lg" />
              <div className="h-10 w-36 bg-gray-800 rounded-lg" />
            </div>
          </div>
          <div className="hidden lg:block w-[180px] h-[260px] bg-gray-800 rounded-xl flex-shrink-0" />
        </div>
        <div className="absolute bottom-5 left-12 lg:left-16 flex gap-2">
          <div className="h-[3px] w-6 bg-gray-700 rounded-full" />
          <div className="h-[3px] w-2 bg-gray-800 rounded-full" />
          <div className="h-[3px] w-2 bg-gray-800 rounded-full" />
          <div className="h-[3px] w-2 bg-gray-800 rounded-full" />
          <div className="h-[3px] w-2 bg-gray-800 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-10 py-10">
        {/* Trending grid skeleton */}
        <section className="px-8 lg:px-12">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 w-48 bg-gray-800 rounded" />
            <div className="h-4 w-16 bg-gray-800 rounded" />
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </section>

        {/* Scroll row skeletons */}
        {Array.from({ length: 5 }).map((_, i) => (
          <section key={i} className="px-8 lg:px-12">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 w-44 bg-gray-800 rounded" />
              <div className="h-4 w-16 bg-gray-800 rounded" />
            </div>
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 8 }).map((_, j) => (
                <CardSkeleton key={j} />
              ))}
            </div>
          </section>
        ))}

        {/* Explore CTA skeleton */}
        <section className="px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-40 bg-gray-900 border border-gray-800 rounded-2xl" />
            <div className="h-40 bg-gray-900 border border-gray-800 rounded-2xl" />
          </div>
        </section>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[140px] bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
      <div className="aspect-3/4 w-full bg-gray-800" />
      <div className="p-2 space-y-1.5">
        <div className="h-3 w-4/5 bg-gray-800 rounded" />
        <div className="h-2.5 w-1/2 bg-gray-800 rounded" />
      </div>
    </div>
  );
}
