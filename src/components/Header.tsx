import Link from "next/link";

// Dan Koe brief: logo mark on the left, ONE link on the right. Nothing else.
export default function Header() {
  return (
    <header>
      <nav className="mx-auto flex max-w-content items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <Link href="/" aria-label="Home" className="inline-flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-g3.jpg"
            alt="G3 — Gourav Boruah"
            className="-mt-2 h-16 w-auto mix-blend-screen md:-mt-3 md:h-20"
          />
        </Link>

        <Link
          href="#newsletter"
          className="-m-3 bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300 bg-clip-text p-3 font-bold text-transparent drop-shadow-[0_0_10px_rgba(56,132,255,0.45)] transition-opacity duration-200 hover:opacity-80"
        >
          Join The Tribe
        </Link>
      </nav>
    </header>
  );
}
