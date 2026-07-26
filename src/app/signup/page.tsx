"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    // Passwordless sign-up. name/phone ride along as user metadata; a database
    // trigger turns that into a profiles row with role = 'reader'.
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { name, phone },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMessage("Almost there — check your email for a link to finish signing up.");
  }

  return (
    <section className="mx-auto max-w-md px-6 py-24 md:py-32">
      <h1 className="h-section">Join as a reader</h1>
      <p className="subhead mt-4">No password — we&apos;ll email you a sign-in link.</p>

      <form onSubmit={handleSignup} className="mt-10 space-y-5">
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
          className="font-bold text-white underline underline-offset-4 transition-opacity hover:opacity-70 disabled:opacity-40"
        >
          Send my link &rarr;
        </button>
      </form>

      {message && <p className="mt-6 text-white">{message}</p>}
      {error && <p className="mt-6 text-red-400">{error}</p>}

      <p className="mt-10 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-white underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </section>
  );
}
