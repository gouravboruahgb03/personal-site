import Link from "next/link";
import Image from "next/image";

export type PostCardData = {
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
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

// Blog card anatomy from the brief: 16:9 off-white image, bold title (2 lines),
// one-line subtitle, "Read Full Post", hairline rule, italic faint byline.
export default function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link href={`/writing/${post.slug}`} className="group block">
      <div className="relative aspect-[16/9] overflow-hidden bg-surface">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-200 group-hover:brightness-[0.85]"
          />
        ) : (
          <div className="h-full w-full bg-surface transition duration-200 group-hover:brightness-[0.85]" />
        )}
      </div>

      <h3 className="card-title mt-6 line-clamp-2">{post.title}</h3>
      {post.excerpt && (
        <p className="mt-2 line-clamp-1 text-muted">{post.excerpt}</p>
      )}
      <span className="mt-4 inline-block font-bold italic text-white underline underline-offset-4">
        Read Full Post
      </span>

      <hr className="mt-6 border-rule" />
      <p className="meta mt-4">
        Gourav Boruah &nbsp;&bull;&nbsp; {formatDate(post.published_at)}
      </p>
    </Link>
  );
}
