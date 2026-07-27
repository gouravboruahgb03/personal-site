"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { JSONContent } from "@tiptap/core";
import { createClient } from "@/lib/supabase/client";
import CoverImage from "./CoverImage";
import WritingEditor from "./WritingEditor";

type SaveStatus = "idle" | "saving" | "saved" | "error";

const SAVE_INTERVAL_MS = 10_000;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PostEditor() {
  const supabase = createClient();

  const [postId, setPostId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [initialContent, setInitialContent] = useState<JSONContent | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");

  // Publish panel state
  const [showPublish, setShowPublish] = useState(false);
  const [publishBusy, setPublishBusy] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [shareToSocials, setShareToSocials] = useState(false);
  const [crosspostNote, setCrosspostNote] = useState<string | null>(null);
  const [scheduledNote, setScheduledNote] = useState<string | null>(null);
  const [scheduleMode, setScheduleMode] = useState(false);
  const [scheduleAt, setScheduleAt] = useState("");

  // Latest values for the save loop
  const contentRef = useRef<JSONContent | null>(null);
  const titleRef = useRef("");
  const coverRef = useRef<string | null>(null);
  const postIdRef = useRef<string | null>(null);
  const dirtyRef = useRef(false);
  const savingRef = useRef(false);

  titleRef.current = title;
  coverRef.current = cover;
  postIdRef.current = postId;

  // Load an existing draft if ?id= is in the URL
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
      setLoaded(true);
      return;
    }
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("posts")
        .select("title, content, cover_image, slug, excerpt, status")
        .eq("id", id)
        .single();
      if (!active) return;
      if (data) {
        setPostId(id);
        setTitle(data.title === "Untitled" ? "" : (data.title ?? ""));
        setCover(data.cover_image ?? null);
        setExcerpt(data.excerpt ?? "");
        if (data.slug && !data.slug.startsWith("draft-")) setSlug(data.slug);
        if (data.status === "published") setPublishedSlug(data.slug);
        const c = (data.content as JSONContent) ?? null;
        setInitialContent(c);
        contentRef.current = c;
      }
      setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, [supabase]);

  const onContentChange = useCallback((json: JSONContent) => {
    contentRef.current = json;
    dirtyRef.current = true;
  }, []);

  useEffect(() => {
    if (loaded) dirtyRef.current = true;
  }, [title, cover, loaded]);

  const save = useCallback(async () => {
    if (savingRef.current || !dirtyRef.current) return;
    savingRef.current = true;
    dirtyRef.current = false;
    setStatus("saving");

    const payload = {
      title: titleRef.current.trim() || "Untitled",
      content: contentRef.current,
      cover_image: coverRef.current,
    };

    try {
      if (!postIdRef.current) {
        const draftSlug = `draft-${crypto.randomUUID()}`;
        const { data, error } = await supabase
          .from("posts")
          .insert({ ...payload, slug: draftSlug, status: "draft" })
          .select("id")
          .single();
        if (error) throw error;
        setPostId(data.id);
        postIdRef.current = data.id;
        window.history.replaceState({}, "", `/admin/write?id=${data.id}`);
      } else {
        const { error } = await supabase
          .from("posts")
          .update(payload)
          .eq("id", postIdRef.current);
        if (error) throw error;
      }
      setStatus("saved");
    } catch {
      dirtyRef.current = true;
      setStatus("error");
    } finally {
      savingRef.current = false;
    }
  }, [supabase]);

  useEffect(() => {
    const interval = setInterval(() => void save(), SAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [save]);

  function openPublish() {
    setPublishError(null);
    if (!slug) setSlug(slugify(title));
    setShowPublish(true);
  }

  async function publishPost() {
    const finalSlug = slugify(slug) || slugify(title) || `post-${Date.now()}`;

    // If scheduling, validate the chosen time is in the future
    let scheduledIso: string | null = null;
    if (scheduleMode) {
      if (!scheduleAt) {
        setPublishError("Pick a date and time to schedule.");
        return;
      }
      const when = new Date(scheduleAt);
      if (Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) {
        setPublishError("Choose a time in the future.");
        return;
      }
      scheduledIso = when.toISOString();
    }

    setPublishBusy(true);
    setPublishError(null);

    const payload = {
      title: title.trim() || "Untitled",
      content: contentRef.current,
      cover_image: cover,
      slug: finalSlug,
      excerpt: excerpt.trim() || null,
      crosspost: shareToSocials,
      status: scheduleMode ? "scheduled" : "published",
      scheduled_at: scheduleMode ? scheduledIso : null,
      published_at: scheduleMode ? null : new Date().toISOString(),
    };

    try {
      if (!postIdRef.current) {
        const { data, error } = await supabase
          .from("posts")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        setPostId(data.id);
        postIdRef.current = data.id;
        window.history.replaceState({}, "", `/admin/write?id=${data.id}`);
      } else {
        const { error } = await supabase
          .from("posts")
          .update(payload)
          .eq("id", postIdRef.current);
        if (error) throw error;
      }
      setSlug(finalSlug);
      setShowPublish(false);

      if (scheduleMode) {
        // Scheduled: the background job will publish + cross-post at the set time
        setPublishedSlug(null);
        setCrosspostNote(null);
        setScheduledNote(
          `Scheduled for ${new Date(scheduledIso!).toLocaleString()}`,
        );
      } else {
        setScheduledNote(null);
        setPublishedSlug(finalSlug);
        if (shareToSocials && postIdRef.current) {
          setCrosspostNote("Sending to your socials…");
          try {
            const res = await fetch("/api/crosspost", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: postIdRef.current }),
            });
            const data = (await res.json()) as { error?: string };
            setCrosspostNote(
              res.ok
                ? "Shared to socials ✓"
                : `Social share failed: ${data.error}`,
            );
          } catch {
            setCrosspostNote("Social share failed (network).");
          }
        }
      }
    } catch (e) {
      const err = e as { code?: string; message?: string };
      setPublishError(
        err.code === "23505"
          ? "That slug is already taken — pick a different one."
          : err.message || "Could not publish.",
      );
    } finally {
      setPublishBusy(false);
    }
  }

  const statusLabel =
    status === "saving"
      ? "Saving…"
      : status === "saved"
        ? "Saved"
        : status === "error"
          ? "Couldn't save — retrying…"
          : "Draft";

  if (!loaded) {
    return <p className="text-muted">Loading…</p>;
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="eyebrow">Write</p>
        <div className="flex items-center gap-5">
          {publishedSlug && (
            <a
              href={`/writing/${publishedSlug}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-emerald-400 underline underline-offset-4 hover:opacity-70"
            >
              View post &rarr;
            </a>
          )}
          {scheduledNote && (
            <span className="text-sm text-emerald-400">{scheduledNote}</span>
          )}
          {crosspostNote && (
            <span className="text-sm text-faint">{crosspostNote}</span>
          )}
          <span
            className={`text-sm ${status === "error" ? "text-red-400" : "text-faint"}`}
          >
            {statusLabel}
          </span>
          <button
            type="button"
            onClick={openPublish}
            className="rounded bg-white px-4 py-1.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            {publishedSlug ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {showPublish && (
        <div className="mb-8 border border-rule p-6">
          <p className="eyebrow">{publishedSlug ? "Update post" : "Publish post"}</p>

          <label className="mt-5 block text-sm text-muted">Slug (the web address)</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={slugify(title) || "my-post"}
            className="mt-2 w-full border-b border-rule bg-transparent py-2 text-white focus:border-white focus:outline-none"
          />
          <p className="mt-2 text-xs text-faint">
            Will live at /writing/{slugify(slug) || slugify(title) || "my-post"}
          </p>

          <label className="mt-6 block text-sm text-muted">Excerpt (short summary)</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="mt-2 w-full resize-none border border-rule bg-transparent p-3 text-white focus:border-white focus:outline-none"
          />

          <div className="mt-6">
            <span className="block text-sm text-muted">When</span>
            <div className="mt-2 flex gap-6 text-sm text-white">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  checked={!scheduleMode}
                  onChange={() => setScheduleMode(false)}
                  className="accent-white"
                />
                Publish now
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  checked={scheduleMode}
                  onChange={() => setScheduleMode(true)}
                  className="accent-white"
                />
                Schedule for later
              </label>
            </div>
            {scheduleMode && (
              <input
                type="datetime-local"
                value={scheduleAt}
                onChange={(e) => setScheduleAt(e.target.value)}
                className="mt-3 border border-rule bg-transparent p-2 text-white [color-scheme:dark] focus:border-white focus:outline-none"
              />
            )}
          </div>

          <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm text-muted">
            <input
              type="checkbox"
              checked={shareToSocials}
              onChange={(e) => setShareToSocials(e.target.checked)}
              className="h-4 w-4 accent-emerald-500"
            />
            Also share to my socials (LinkedIn &amp; X)
          </label>

          {publishError && (
            <p className="mt-3 text-sm text-red-400">{publishError}</p>
          )}

          <div className="mt-6 flex items-center gap-5">
            <button
              type="button"
              onClick={publishPost}
              disabled={publishBusy}
              className="rounded bg-emerald-500 px-5 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {publishBusy
                ? "Working…"
                : scheduleMode
                  ? "Schedule"
                  : publishedSlug
                    ? "Update now"
                    : "Publish now"}
            </button>
            <button
              type="button"
              onClick={() => setShowPublish(false)}
              className="text-sm text-muted hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <CoverImage value={cover} onChange={setCover} />

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="mb-6 w-full bg-transparent text-4xl font-bold leading-tight text-white placeholder:text-faint focus:outline-none"
      />

      <WritingEditor initialContent={initialContent} onChange={onContentChange} />
    </>
  );
}
