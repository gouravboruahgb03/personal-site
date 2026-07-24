import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type PostListItem = {
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function WritingPage() {
  const supabase = createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("title, slug, excerpt, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">Writing</h1>

      {error && (
        <p className="mt-8 text-red-600">
          Sorry, something went wrong loading the posts.
        </p>
      )}

      {!error && (!posts || posts.length === 0) && (
        <p className="mt-8 opacity-60">No posts published yet.</p>
      )}

      <ul className="mt-8 space-y-8">
        {posts?.map((post: PostListItem) => (
          <li key={post.slug}>
            <Link href={`/writing/${post.slug}`} className="group block">
              <h2 className="text-xl font-semibold group-hover:underline">
                {post.title}
              </h2>
              {post.published_at && (
                <time className="mt-1 block text-sm opacity-60">
                  {formatDate(post.published_at)}
                </time>
              )}
              {post.excerpt && <p className="mt-2 opacity-80">{post.excerpt}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
