import Link from "next/link";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-content flex-col items-center justify-center px-6 py-24 text-center md:px-10">
      <p className="eyebrow">Error 404</p>
      <h1 className="h-hero mt-6">Lost the thread.</h1>
      <p className="subhead mx-auto mt-6 max-w-md">
        This page doesn&apos;t exist — it may have moved, or the link was
        mistyped. Let&apos;s get you back on track.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
        <Link
          href="/"
          className="font-bold text-white underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Go home &rarr;
        </Link>
        <Link
          href="/writing"
          className="text-muted underline underline-offset-4 transition-colors hover:text-white"
        >
          Read the blog
        </Link>
      </div>
    </section>
  );
}
