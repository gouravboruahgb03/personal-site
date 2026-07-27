const SITE_URL = "https://personal-site-omega-neon.vercel.app";

// Flatten ProseMirror JSON content into plain text (for tweets etc.)
export function extractText(node: unknown): string {
  const n = node as { type?: string; text?: string; content?: unknown[] };
  if (!n) return "";
  if (n.type === "text") return n.text ?? "";
  if (Array.isArray(n.content)) {
    const inner = n.content.map(extractText).join("");
    const block = ["paragraph", "heading", "blockquote", "listItem"].includes(
      n.type ?? "",
    );
    return inner + (block ? "\n\n" : "");
  }
  return "";
}

export type CrosspostPost = {
  title: string | null;
  excerpt: string | null;
  slug: string;
  cover_image: string | null;
  content: unknown;
  published_at: string | null;
};

// POST a post's data to the configured cross-post webhook (Make.com).
export async function sendToWebhook(post: CrosspostPost): Promise<void> {
  const webhook = process.env.CROSSPOST_WEBHOOK_URL;
  if (!webhook) throw new Error("No cross-post webhook is configured.");

  const payload = {
    title: post.title,
    excerpt: post.excerpt ?? "",
    url: `${SITE_URL}/writing/${post.slug}`,
    cover_image: post.cover_image ?? "",
    text: extractText(post.content).trim(),
    published_at: post.published_at,
  };

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}
