"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UnsubscribeClient() {
  const supabase = createClient();
  const params = useSearchParams();
  const token = params.get("token");

  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function confirmUnsubscribe() {
    if (!token) return;
    setState("busy");
    // `unsubscribe` is a SECURITY DEFINER function: it flips this one person's
    // `subscribed` flag to false, matched only by their secret token.
    const { data, error } = await supabase.rpc("unsubscribe", { token });
    if (error) {
      setState("error");
      return;
    }
    setState(data ? "done" : "done");
  }

  return (
    <section className="mx-auto max-w-md px-6 py-24 text-center md:py-32">
      {!token ? (
        <>
          <h1 className="h-section">Invalid link</h1>
          <p className="subhead mt-4">
            This unsubscribe link is missing its code. Please use the link from
            the bottom of the email.
          </p>
        </>
      ) : state === "done" ? (
        <>
          <h1 className="h-section">You&apos;re unsubscribed</h1>
          <p className="subhead mt-4">
            You won&apos;t receive any more newsletter emails. You can still read
            everything on the site anytime.
          </p>
          <Link
            href="/writing"
            className="mt-8 inline-block font-bold text-white underline underline-offset-4 hover:opacity-70"
          >
            Back to the blog &rarr;
          </Link>
        </>
      ) : state === "error" ? (
        <>
          <h1 className="h-section">Something went wrong</h1>
          <p className="subhead mt-4">
            We couldn&apos;t process that just now. Please try the link again.
          </p>
        </>
      ) : (
        <>
          <h1 className="h-section">Unsubscribe?</h1>
          <p className="subhead mt-4">
            Click below to stop receiving newsletter emails. You&apos;ll still be
            able to read everything on the site.
          </p>
          <button
            type="button"
            onClick={confirmUnsubscribe}
            disabled={state === "busy"}
            className="mt-8 rounded bg-white px-6 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {state === "busy" ? "Unsubscribing…" : "Confirm unsubscribe"}
          </button>
        </>
      )}
    </section>
  );
}
