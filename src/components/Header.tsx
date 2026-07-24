"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          Gourav Boruah
        </Link>

        {/* Links shown in a row on tablet/desktop */}
        <ul className="hidden gap-8 sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="opacity-70 hover:opacity-100">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Hamburger button, shown only on mobile */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="-mr-2 inline-flex items-center justify-center rounded p-2 sm:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Dropdown menu, shown on mobile only when open */}
      {open && (
        <ul className="flex flex-col border-t border-black/10 px-6 py-2 sm:hidden dark:border-white/10">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 opacity-70 hover:opacity-100"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
