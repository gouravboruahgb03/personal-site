"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Shown in place of the locked portion of a members-only post. The locked text
// is never sent to the browser — this gate is all the reader receives below the
// free preview. Signing up (passwordless) returns them right back to this post.
export default function PostGate({ slug }: { slug: string }) {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    const next = `/writing/${slug}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { name, phone },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          next,
        )}`,
      },
    });

    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMessage(
      "Check your email for a link — click it and you'll land right back here with the full post unlocked.",
    );
  }

  return (
    <div className="relative">
      {/* Fade the last of the visible text into the page so the cut feels
          intentional, not broken. The page background is black (#000). */}
      <div className="pointer-events-none -mt-40 h-40 bg-gradient-to-b from-transparent to-black" />

      <div className="border-t border-rule pt-10 text-center">
        <p className="eyebrow">Members only</p>
        <h2 className="h-section mt-4 text-3xl">Keep reading — free, always</h2>
        <p className="subhead mx-auto mt-4 max-w-md">
          Enter your details and I&apos;ll email you a one-tap link. No password,
          no cost — you&apos;ll come straight back to finish this post.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 max-w-md space-y-4 text-left"
        >
          <div>
            <label className="eyebrow block">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full border-b border-rule bg-transparent py-3 text-white focus:border-white focus:outline-none"
            />
          </div>
          <div>
            <label className="eyebrow block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border-b border-rule bg-transparent py-3 text-white focus:border-white focus:outline-none"
            />
          </div>
          <div>
            <label className="eyebrow block">Phone (optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full border-b border-rule bg-transparent py-3 text-white focus:border-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="rounded bg-white px-6 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {busy ? "Sending…" : "Unlock the rest →"}
          </button>
        </form>

        {message && <p className="mx-auto mt-6 max-w-md text-white">{message}</p>}
        {error && <p className="mx-auto mt-6 max-w-md text-red-400">{error}</p>}
      </div>
    </div>
  );
}
