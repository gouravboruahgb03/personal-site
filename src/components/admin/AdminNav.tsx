"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";

const links = [
  { href: "/admin/write", label: "Write" },
  { href: "/admin/posts", label: "My posts" },
  { href: "/admin/readers", label: "Readers" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-black/90 backdrop-blur">
      <nav className="mx-auto flex max-w-content items-center justify-between px-6 py-3 md:px-10">
        <div className="flex items-center gap-6">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold transition-opacity hover:opacity-70 ${
                  active ? "text-white" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-white"
          >
            View site
          </Link>
          <SignOutButton />
        </div>
      </nav>
    </header>
  );
}
