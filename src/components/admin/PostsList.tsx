"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import NewsletterButton from "./NewsletterButton";

type Post = {
  id: string;
  title: string | null;
  slug: string;
  status: string;
  published_at: string | null;
  created_at: string;
};

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PostsList({ posts }: { posts: Post[] }) {
  const supabase = createClient();
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function changeStatus(id: string, status: "published" | "draft") {
    setBusyId(id);
    const payload =
      status === "published"
        ? { status: "published", published_at: new Date().toISOString() }
        : { status: "draft", published_at: null };
    const { error } = await supabase.from("posts").update(payload).eq("id", id);
    setBusyId(null);
    if (error) {
      alert("Could not update: " + error.message);
      return;
    }
    router.refresh();
  }

  async function remove(id: string) {
    setBusyId(id);
    const { error } = await supabase.from("posts").delete().eq("id", id);
    setBusyId(null);
    setConfirmId(null);
    if (error) {
      alert("Could not delete: " + error.message);
      return;
    }
    router.refresh();
  }

  if (posts.length === 0) {
    return <p className="mt-10 text-faint">No posts yet. Write your first one.</p>;
  }

  return (
    <ul className="mt-10 border-t border-rule">
      {posts.map((post) => {
        const isPublished = post.status === "published";
        const busy = busyId === post.id;
        return (
          <li
            key={post.id}
            className="flex flex-col gap-3 border-b border-rule py-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="card-title">{post.title || "Untitled"}</span>
                <span
                  className={`text-xs uppercase tracking-wider ${
                    isPublished ? "text-emerald-400" : "text-faint"
                  }`}
                >
                  {post.status}
                </span>
              </div>
              <p className="meta mt-1 not-italic">
                {isPublished && post.published_at
                  ? `Published ${formatDate(post.published_at)}`
                  : `Created ${formatDate(post.created_at)}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-sm">
              <Link
                href={`/admin/write?id=${post.id}`}
                className="text-white underline underline-offset-4 hover:opacity-70"
              >
                Edit
              </Link>

              {isPublished && (
                <NewsletterButton postId={post.id} title={post.title} />
              )}

              {isPublished ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => changeStatus(post.id, "draft")}
                  className="text-muted transition-colors hover:text-white disabled:opacity-40"
                >
                  Unpublish
                </button>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => changeStatus(post.id, "published")}
                  className="text-emerald-400 transition-opacity hover:opacity-70 disabled:opacity-40"
                >
                  Publish
                </button>
              )}

              {confirmId === post.id ? (
                <span className="flex items-center gap-3">
                  <span className="text-faint">Delete?</span>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => remove(post.id)}
                    className="font-bold text-red-400 hover:opacity-70 disabled:opacity-40"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(null)}
                    className="text-muted hover:text-white"
                  >
                    No
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmId(post.id)}
                  className="text-red-400 transition-opacity hover:opacity-70"
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
