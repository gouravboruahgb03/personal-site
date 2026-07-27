import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PostGate from "@/components/PostGate";

// ---------------------------------------------------------------------------
// Rich-text renderer — walks the ProseMirror/Tiptap-style JSON in `content`
// and emits plain semantic elements. Styling comes from `.prose-post` in
// globals.css, so the markup stays clean.
// ---------------------------------------------------------------------------
type Mark = { type: string; attrs?: Record<string, string> };
type ContentNode = {
  type: string;
  attrs?: Record<string, string | number>;
  content?: ContentNode[];
  text?: string;
  marks?: Mark[];
};

function applyMarks(text: ReactNode, marks: Mark[] | undefined, key: string) {
  if (!marks?.length) return text;
  return marks.reduce<ReactNode>((acc, mark, i) => {
    const k = `${key}-m${i}`;
    switch (mark.type) {
      case "bold":
        return <strong key={k}>{acc}</strong>;
      case "italic":
        return <em key={k}>{acc}</em>;
      case "code":
        return <code key={k}>{acc}</code>;
      case "link":
        return (
          <a key={k} href={mark.attrs?.href} target="_blank" rel="noreferrer">
            {acc}
          </a>
        );
      default:
        return acc;
    }
  }, text);
}

function renderNode(node: ContentNode, key: string): ReactNode {
  const children = node.content?.map((child, i) => renderNode(child, `${key}-${i}`));

  switch (node.type) {
    case "doc":
      return <>{children}</>;
    case "text":
      return applyMarks(node.text, node.marks, key);
    case "paragraph":
      return <p key={key}>{children}</p>;
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      if (level <= 2) return <h2 key={key}>{children}</h2>;
      return <h3 key={key}>{children}</h3>;
    }
    case "bulletList":
      return <ul key={key}>{children}</ul>;
    case "orderedList":
      return <ol key={key}>{children}</ol>;
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return <blockquote key={key}>{children}</blockquote>;
    case "codeBlock":
      return (
        <pre key={key}>
          <code>{children}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr key={key} />;
    case "hardBreak":
      return <br key={key} />;
    case "image":
      return node.attrs?.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={key} src={String(node.attrs.src)} alt={String(node.attrs.alt ?? "")} />
      ) : null;
    default:
      return children ? <>{children}</> : null;
  }
}

function PostBody({ content }: { content: unknown }) {
  const doc = content as ContentNode | null;
  if (!doc || doc.type !== "doc" || !doc.content?.length) {
    return <p>This post doesn&apos;t have any content yet.</p>;
  }
  return <>{renderNode(doc, "root")}</>;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type Post = {
  title: string;
  excerpt: string | null;
  published_at: string | null;
  cover_image: string | null;
  content: unknown;
  access_level: string | null;
  locked: boolean;
};

const SITE_URL = "https://personal-site-omega-neon.vercel.app";

// The database function `get_post` does the members-only trimming itself: for a
// logged-out guest on a members-only post it returns only the ~40% preview and
// sets locked=true. The full body never leaves the server — not even via a
// direct API call — so the gate can't be bypassed.
async function getPost(slug: string): Promise<Post | null> {
  const supabase = createClient();
  const { data } = await supabase.rpc("get_post", { post_slug: slug });
  return (data as Post) ?? null;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post not found" };

  const description = post.excerpt ?? undefined;
  const url = `${SITE_URL}/writing/${params.slug}`;
  const images = post.cover_image ? [{ url: post.cover_image }] : undefined;

  return {
    title: post.title,
    description,
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url,
      images,
    },
    twitter: {
      card: post.cover_image ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  // `locked` comes straight from the database — it already trimmed the body
  // for guests, so `post.content` here is only the preview when locked.
  const locked = post.locked;

  return (
    <article className="mx-auto max-w-prose px-6 py-24 md:py-32">
      <Link
        href="/writing"
        className="text-sm text-muted transition-colors duration-200 hover:text-white"
      >
        &larr; Back to writing
      </Link>

      <header className="mt-10">
        <h1 className="h-section">{post.title}</h1>
        <p className="meta mt-4">
          Gourav Boruah &nbsp;&bull;&nbsp; {formatDate(post.published_at)}
        </p>
      </header>

      {post.cover_image && (
        <div className="mt-10 aspect-[16/9] overflow-hidden bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="prose-post mt-12">
        <PostBody content={post.content} />
      </div>

      {/* When locked, the rest of the post simply does not exist in this HTML —
          the gate is all that follows the preview. */}
      {locked && <PostGate slug={params.slug} />}
    </article>
  );
}
