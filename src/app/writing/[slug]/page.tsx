import type { ReactNode, ElementType } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Rich-text renderer
// Posts store their body in `content` as structured JSON (ProseMirror/Tiptap
// style). This walks that tree and renders it as real HTML elements.
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
        return (
          <code key={k} className="rounded bg-black/5 px-1.5 py-0.5 text-[0.9em] dark:bg-white/10">
            {acc}
          </code>
        );
      case "link":
        return (
          <a
            key={k}
            href={mark.attrs?.href}
            className="underline underline-offset-2 hover:opacity-70"
            target="_blank"
            rel="noreferrer"
          >
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
      return (
        <p key={key} className="mb-6">
          {children}
        </p>
      );
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const Tag = `h${Math.min(Math.max(level, 1), 6)}` as ElementType;
      const size = level <= 1 ? "text-3xl" : level === 2 ? "text-2xl" : "text-xl";
      return (
        <Tag key={key} className={`${size} mb-4 mt-10 font-semibold leading-snug`}>
          {children}
        </Tag>
      );
    }
    case "bulletList":
      return (
        <ul key={key} className="mb-6 list-disc space-y-2 pl-6">
          {children}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={key} className="mb-6 list-decimal space-y-2 pl-6">
          {children}
        </ol>
      );
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return (
        <blockquote key={key} className="mb-6 border-l-4 border-black/20 pl-5 italic opacity-80 dark:border-white/20">
          {children}
        </blockquote>
      );
    case "codeBlock":
      return (
        <pre key={key} className="mb-6 overflow-x-auto rounded-lg bg-black/5 p-4 text-sm dark:bg-white/10">
          <code>{children}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr key={key} className="my-10 border-black/10 dark:border-white/10" />;
    case "hardBreak":
      return <br key={key} />;
    case "image":
      return node.attrs?.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={key} src={String(node.attrs.src)} alt={String(node.attrs.alt ?? "")} className="my-8 rounded-lg" />
      ) : null;
    default:
      return children ? <>{children}</> : null;
  }
}

function PostBody({ content }: { content: unknown }) {
  const doc = content as ContentNode | null;
  if (!doc || doc.type !== "doc" || !doc.content?.length) {
    return <p className="opacity-60">This post doesn&apos;t have any content yet.</p>;
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
  published_at: string | null;
  cover_image: string | null;
  content: unknown;
};

async function getPost(slug: string): Promise<Post | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("posts")
    .select("title, published_at, cover_image, content")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data as Post | null;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return { title: post ? post.title : "Post not found" };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-[680px] px-6 py-16">
      <Link href="/writing" className="text-sm opacity-60 hover:underline">
        &larr; Back to writing
      </Link>

      <header className="mt-8">
        <h1 className="text-4xl font-bold leading-tight tracking-tight">{post.title}</h1>
        {post.published_at && (
          <time className="mt-3 block text-sm opacity-60">{formatDate(post.published_at)}</time>
        )}
      </header>

      {post.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image}
          alt=""
          className="mt-8 w-full rounded-xl object-cover"
        />
      )}

      <div className="mt-10 text-lg leading-8">
        <PostBody content={post.content} />
      </div>
    </article>
  );
}
