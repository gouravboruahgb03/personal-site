"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Admin: email + password
  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  // Reader: magic link (no password)
  async function handleMagicLink() {
    if (!email) {
      setError("Enter your email first.");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMessage("Check your email for a sign-in link.");
  }

  return (
    <section className="mx-auto max-w-md px-6 py-24 md:py-32">
      <h1 className="h-section">Sign in</h1>

      <form onSubmit={handlePasswordLogin} className="mt-10 space-y-5">
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
          <label className="eyebrow block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border-b border-rule bg-transparent py-3 text-white focus:border-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="font-bold text-white underline underline-offset-4 transition-opacity hover:opacity-70 disabled:opacity-40"
        >
          Sign in &rarr;
        </button>
      </form>

      <div className="mt-10 border-t border-rule pt-6">
        <p className="text-sm text-faint">Returning reader? No password needed.</p>
        <button
          type="button"
          onClick={handleMagicLink}
          disabled={busy}
          className="mt-3 font-bold text-white underline underline-offset-4 transition-opacity hover:opacity-70 disabled:opacity-40"
        >
          Email me a magic link &rarr;
        </button>
      </div>

      {message && <p className="mt-6 text-white">{message}</p>}
      {error && <p className="mt-6 text-red-400">{error}</p>}

      <p className="mt-10 text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="text-white underline underline-offset-4">
          Create a reader account
        </Link>
      </p>
    </section>
  );
}
