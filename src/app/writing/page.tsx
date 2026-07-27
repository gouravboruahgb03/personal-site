import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import PostCard, { type PostCardData } from "@/components/PostCard";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Writing",
};

export default async function WritingPage() {
  const supabase = createClient();
  // Metadata only (no body text) — safe to show everyone, includes members-only
  // posts so guests can discover them and hit the gate.
  const { data: posts, error } = await supabase.rpc("list_published_posts");

  return (
    <section className="mx-auto max-w-content px-6 py-24 md:px-10 md:py-32">
      <Reveal>
        <Eyebrow>The Blog</Eyebrow>
        <h1 className="h-section mt-6">Writing.</h1>
      </Reveal>

      {error && (
        <p className="subhead mt-10 text-faint">
          Sorry, something went wrong loading the posts.
        </p>
      )}

      {!error && (!posts || posts.length === 0) && (
        <p className="subhead mt-10 text-faint">No posts published yet.</p>
      )}

      {posts && posts.length > 0 && (
        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {(posts as PostCardData[]).map((post, i) => (
            <Reveal as="div" key={post.slug} delay={(i % 3) * 80}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
