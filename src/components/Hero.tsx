import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import ShatterImage from "@/components/ShatterImage";

export default function Hero() {
  return (
    <section className="mx-auto max-w-content px-6 md:px-10">
      <div className="grid items-center gap-12 pb-24 pt-6 md:grid-cols-2 md:gap-16 md:pb-40 md:pt-14">
        {/* Left — the words, staggered in on load */}
        <div>
          <Reveal delay={0}>
            <Eyebrow>Gourav Boruah</Eyebrow>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="h-hero mt-6">
              Automate
              <br />
              Your Life
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 text-2xl font-medium text-white md:text-3xl">
              Work less, Enjoy more.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <Link
              href="/writing"
              className="mt-8 inline-block italic text-white underline underline-offset-4 transition-colors duration-200 hover:text-muted"
            >
              Read The G&apos;s Ideas
            </Link>
          </Reveal>

          <Reveal delay={320}>
            <p className="mt-6 bg-gradient-to-r from-neutral-400 via-white to-neutral-400 bg-clip-text text-base font-medium text-transparent">
              Get exposed: A.I &amp; Automation, The Mind, and Value Creation.
            </p>
          </Reveal>

          <Reveal delay={400}>
            <Link
              href="#newsletter"
              className="mt-3 inline-block font-bold text-white underline underline-offset-4 transition-colors duration-200 hover:text-muted"
            >
              Join The Tribe &rarr;
            </Link>
          </Reveal>
        </div>

        {/* Right — the illustration blasts apart and reassembles */}
        <Reveal delay={200} className="justify-self-center md:justify-self-end">
          <ShatterImage src="/hero-figure.jpg" />
        </Reveal>
      </div>
    </section>
  );
}
