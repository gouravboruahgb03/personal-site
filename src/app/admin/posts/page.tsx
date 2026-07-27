import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PostsList from "@/components/admin/PostsList";

export const metadata = {
  title: "Posts",
};

export default async function PostsPage() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, status, published_at, created_at")
    .order("created_at", { ascending: false });

  return (
    <section className="mx-auto max-w-content px-6 py-24 md:px-10 md:py-32">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Admin</p>
        <Link
          href="/admin/write"
          className="text-sm font-bold text-white underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          New post &rarr;
        </Link>
      </div>

      <h1 className="h-section mt-6">Posts</h1>

      <PostsList posts={posts ?? []} />
    </section>
  );
}
