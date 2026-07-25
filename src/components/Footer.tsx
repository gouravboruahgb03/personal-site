import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

// X and LinkedIn for now (light-blue). Add YouTube / Instagram here later.
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
      <path fill="url(#social-blue)" d={paths[icon]} />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="newsletter" className="border-t border-rule">
      {/* Shared light-blue gradient for the social icons */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="social-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>
      </svg>

      <div className="mx-auto max-w-content px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-14 md:grid-cols-[220px_1fr] md:gap-20">
          {/* Left — round photo + socials below (centered) */}
          <div className="flex flex-col items-center">
            <div className="photo-anim aspect-square w-48 overflow-hidden rounded-full border-2 border-white/85">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/gourav.jpg"
                alt="Gourav Boruah"
                className="h-full w-full object-cover brightness-105 saturate-[1.1]"
              />
            </div>
            <div className="mt-6 flex items-center gap-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="drop-shadow-[0_0_6px_rgba(56,189,248,0.5)] transition-opacity duration-200 hover:opacity-75"
                >
                  <SocialIcon icon={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Right — the message */}
          <div>
            <h2 className="h-section">Why should you trust me?</h2>
            <p className="mt-6 text-3xl font-bold text-white md:text-4xl">
              Hi, I&apos;m Gourav Boruah.
            </p>

            <div className="prose-post mt-6">
              <p>Obsessed with the human mind, building systems and writing.</p>
              <p>
                I build systems to automate my tasks and enjoy working
                creatively.
              </p>
            </div>

            <p className="mt-8 text-lg text-white">
              If you like my work, you&apos;re welcome to the tribe:
            </p>
            <div className="mt-4 max-w-xl">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Bottom row — nav only (copyright removed) */}
        <div className="mt-20 flex justify-end border-t border-rule pt-8">
          <nav className="flex gap-8 text-sm text-muted">
            <Link href="/writing" className="transition-colors hover:text-white">
              Writing
            </Link>
            <Link href="/products" className="transition-colors hover:text-white">
              Products
            </Link>
            <Link href="/about" className="transition-colors hover:text-white">
              About
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
