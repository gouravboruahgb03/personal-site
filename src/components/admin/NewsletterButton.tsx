"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// "Send as newsletter" for one published post. Opens a small panel that shows
// how many subscribers it will reach, offers a "test to myself" send first,
// and asks for confirmation before emailing everyone.
export default function NewsletterButton({
  postId,
  title,
}: {
  postId: string;
  title: string | null;
}) {
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [busy, setBusy] = useState<null | "test" | "all">(null);
  const [note, setNote] = useState<string | null>(null);

  async function openPanel() {
    setNote(null);
    setOpen(true);
    setCount(null);
    const { count: c } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "reader")
      .eq("subscribed", true);
    setCount(c ?? 0);
  }

  async function send(testOnly: boolean) {
    setBusy(testOnly ? "test" : "all");
    setNote(null);
    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, testOnly }),
      });
      const data = (await res.json()) as {
        sent?: number;
        error?: string;
      };
      if (!res.ok) {
        setNote(`⚠️ ${data.error ?? "Could not send."}`);
      } else if (testOnly) {
        setNote("✓ Test sent to your inbox.");
      } else {
        setNote(`✓ Sent to ${data.sent} subscriber${data.sent === 1 ? "" : "s"}.`);
      }
    } catch {
      setNote("⚠️ Network error — please try again.");
    } finally {
      setBusy(null);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={openPanel}
        className="text-sky-400 transition-opacity hover:opacity-70"
      >
        Send as newsletter
      </button>
    );
  }

  return (
    <span className="flex flex-wrap items-center gap-3">
      <span className="text-faint">
        Email &ldquo;{title || "Untitled"}&rdquo; to{" "}
        {count === null ? "…" : <strong className="text-white">{count}</strong>}{" "}
        {count === 1 ? "subscriber" : "subscribers"}?
      </span>

      <button
        type="button"
        disabled={busy !== null}
        onClick={() => send(true)}
        className="text-white underline underline-offset-4 hover:opacity-70 disabled:opacity-40"
      >
        {busy === "test" ? "Sending…" : "Send test to myself"}
      </button>

      <button
        type="button"
        disabled={busy !== null || count === 0}
        onClick={() => send(false)}
        className="font-bold text-sky-400 hover:opacity-70 disabled:opacity-40"
      >
        {busy === "all" ? "Sending…" : `Send to all${count ? ` ${count}` : ""}`}
      </button>

      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setNote(null);
        }}
        className="text-muted hover:text-white"
      >
        Cancel
      </button>

      {note && <span className="text-white">{note}</span>}
    </span>
  );
}
