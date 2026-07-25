import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="newsletter" className="border-t border-rule">
      <div className="mx-auto max-w-content px-6 py-24 md:px-10 md:py-32">
        <Eyebrow>Join The Tribe</Eyebrow>
        <h2 className="h-section mt-6 max-w-3xl">
          Get exposed: A.I &amp; Automation, the Mind, and Value Creation.
        </h2>

        <div className="mt-10 max-w-xl">
          <NewsletterForm />
        </div>

        <div className="mt-24 flex flex-col gap-6 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-faint">&copy; {year} Gourav Boruah</p>
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
