"use client";

import { useState } from "react";

// Placeholder newsletter form: confirms locally on submit. Wire this to a real
// email service (ConvertKit, Substack, Resend, etc.) to actually capture signups.
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setDone(true);
  }

  if (done) {
    return <p className="subhead text-white">Thanks — you&apos;re on the list.</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 sm:flex-row sm:items-center"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="w-full border-b border-rule bg-transparent py-3 text-white transition-colors placeholder:text-faint focus:border-white focus:outline-none sm:w-80"
      />
      <button
        type="submit"
        className="text-left font-bold italic text-white underline underline-offset-4 transition-colors duration-200 hover:text-muted"
      >
        Join The Tribe &rarr;
      </button>
    </form>
  );
}
