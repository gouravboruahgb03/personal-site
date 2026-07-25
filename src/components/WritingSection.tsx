import Link from "next/link";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import PostCard, { type PostCardData } from "@/components/PostCard";
import { createClient } from "@/lib/supabase/server";

export default async function WritingSection() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("title, slug, excerpt, cover_image, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(6);

  return (
    <section className="mx-auto max-w-content px-6 py-24 md:px-10 md:py-40">
      <Reveal>
        <Eyebrow>The Blog</Eyebrow>
        <h2 className="h-section mt-6 max-w-2xl">The latest ideas.</h2>
      </Reveal>

      {!posts || posts.length === 0 ? (
        <Reveal>
          <p className="subhead mt-10 text-faint">No posts published yet.</p>
        </Reveal>
      ) : (
        <>
          <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {(posts as PostCardData[]).map((post, i) => (
              <Reveal as="div" key={post.slug} delay={(i % 3) * 80}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>

          {/* Unlock the full newsletter archive */}
          <Reveal className="mt-16 flex justify-center">
            <Link href="/writing" className="unlock-btn px-9 py-4">
              <span className="relative z-10 text-lg font-extrabold tracking-wide text-black drop-shadow-[0_1px_0_rgba(255,255,255,0.45)]">
                UNLOCK MORE
              </span>
            </Link>
          </Reveal>
        </>
      )}
    </section>
  );
}
