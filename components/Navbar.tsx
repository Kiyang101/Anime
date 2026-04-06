import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full h-[10dvh] border-b bg-gray-950/95 backdrop-blur-md flex items-center ">
      <div className="flex h-16 items-center justify-between px-6 lg:px-10 w-full">
        {/* Logo Section */}
        <Link href="/" className="group flex ">
          <h1 className="text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 transition-transform group-hover:scale-105">
            Anime Explorer
          </h1>
        </Link>

        {/* Navigation Links */}
        <div className="flex  space-x-2 md:space-x-4">
          <Link
            href="/anime"
            className="rounded-lg px-4 py-2 text-base font-medium text-gray-300 transition-all hover:bg-gray-800 hover:text-white"
          >
            Season Now
          </Link>
          <Link
            href="/upcoming"
            className="rounded-lg px-4 py-2 text-base font-medium text-gray-300 transition-all hover:bg-gray-800 hover:text-white"
          >
            Season Upcoming
          </Link>
        </div>
      </div>
    </nav>
  );
}
