import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "About",
};

// Social links — X and LinkedIn for now. Add YouTube / Instagram here later.
const socials: { label: string; href: string; icon: "x" | "linkedin" }[] = [
  { label: "X", href: "https://x.com/GouravBoruahgb", icon: "x" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/gourav-boruah-a9aaa6410",
    icon: "linkedin",
  },
];

function SocialIcon({ icon }: { icon: "x" | "linkedin" }) {
  const paths: Record<string, string> = {
    x: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    linkedin:
      "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  };
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <path fill="url(#gold-grad)" d={paths[icon]} />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-content px-6 py-24 md:px-10 md:py-32">
      {/* Shared golden gradient for the social icons */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FCEFA8" />
            <stop offset="45%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8A6D1E" />
          </linearGradient>
        </defs>
      </svg>

      <Reveal>
        <Eyebrow>About</Eyebrow>
      </Reveal>

      <div className="mt-10 grid gap-16 md:grid-cols-2 md:items-center">
        {/* Left — the words */}
        <div>
          <Reveal>
            <h1 className="h-section">Hi, I&apos;m Gourav Boruah</h1>
          </Reveal>

          <div className="prose-post mt-8">
            <Reveal>
              <p>Obsessed with the human mind, building systems and writing.</p>
            </Reveal>
            <Reveal>
              <p>I build systems to automate tasks and enjoy working creatively.</p>
            </Reveal>
          </div>

          <Reveal>
            <div className="mt-10 flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-g3.jpg"
                alt="G3"
                className="h-12 w-auto shrink-0 mix-blend-screen"
              />
              <p className="text-lg text-white">
                If you like my work, you&apos;re welcome to join my tribe:
              </p>
            </div>
            <Link
              href="#newsletter"
              className="mt-4 inline-block bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300 bg-clip-text font-bold text-transparent drop-shadow-[0_0_10px_rgba(56,132,255,0.45)] transition-opacity duration-200 hover:opacity-80"
            >
              Join The Tribe &rarr;
            </Link>
          </Reveal>
        </div>

        {/* Right — the portrait + socials, styled like the reference */}
        <Reveal className="flex flex-col items-center">
          <div className="aspect-square w-full max-w-[360px] overflow-hidden rounded-full border-2 border-white/85">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gourav.jpg"
              alt="Gourav Boruah"
              className="h-full w-full object-cover grayscale"
            />
          </div>

          <div className="mt-8 flex items-center gap-7">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="drop-shadow-[0_0_6px_rgba(212,175,55,0.5)] transition-opacity duration-200 hover:opacity-75"
              >
                <SocialIcon icon={s.icon} />
              </a>
            ))}
            {/* Space reserved for YouTube / Instagram when you add them */}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
