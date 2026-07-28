// Turn a post's Tiptap/ProseMirror JSON into a clean, simple HTML email.
// Email clients are picky, so everything uses inline styles and a narrow,
// single-column layout that renders well in Gmail, Apple Mail, Outlook, etc.

type Mark = { type: string; attrs?: Record<string, unknown> };
type Node = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: Node[];
  text?: string;
  marks?: Mark[];
};

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderInline(node: Node): string {
  if (node.type === "text") {
    let t = esc(node.text ?? "");
    for (const m of node.marks ?? []) {
      if (m.type === "bold") t = `<strong>${t}</strong>`;
      else if (m.type === "italic") t = `<em>${t}</em>`;
      else if (m.type === "code")
        t = `<code style="background:#f2f2f2;padding:1px 4px;border-radius:3px;font-size:14px;">${t}</code>`;
      else if (m.type === "link")
        t = `<a href="${esc(String(m.attrs?.href ?? "#"))}" style="color:#2563eb;text-decoration:underline;">${t}</a>`;
    }
    return t;
  }
  if (node.type === "hardBreak") return "<br/>";
  return (node.content ?? []).map(renderInline).join("");
}

// The inline text of a block's children (used inside list items / quotes).
function inlineChildren(node: Node): string {
  return (node.content ?? [])
    .map((child) =>
      child.type === "paragraph"
        ? (child.content ?? []).map(renderInline).join("")
        : renderInline(child),
    )
    .join(" ");
}

function codeText(node: Node): string {
  if (node.type === "text") return node.text ?? "";
  return (node.content ?? []).map(codeText).join("");
}

function renderBlock(node: Node): string {
  switch (node.type) {
    case "paragraph": {
      const inner = (node.content ?? []).map(renderInline).join("");
      return inner.trim()
        ? `<p style="margin:0 0 18px;line-height:1.7;font-size:16px;color:#1a1a1a;">${inner}</p>`
        : "";
    }
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const tag = level >= 3 ? "h3" : level === 2 ? "h2" : "h1";
      const size = level <= 1 ? "26px" : level === 2 ? "21px" : "18px";
      const inner = (node.content ?? []).map(renderInline).join("");
      return `<${tag} style="margin:30px 0 12px;font-size:${size};line-height:1.3;color:#111;">${inner}</${tag}>`;
    }
    case "bulletList":
      return `<ul style="margin:0 0 18px;padding-left:22px;">${(node.content ?? [])
        .map(renderBlock)
        .join("")}</ul>`;
    case "orderedList":
      return `<ol style="margin:0 0 18px;padding-left:22px;">${(node.content ?? [])
        .map(renderBlock)
        .join("")}</ol>`;
    case "listItem":
      return `<li style="margin:0 0 8px;line-height:1.6;font-size:16px;color:#1a1a1a;">${inlineChildren(
        node,
      )}</li>`;
    case "blockquote":
      return `<blockquote style="margin:0 0 18px;padding:6px 18px;border-left:3px solid #ddd;color:#555;font-style:italic;">${inlineChildren(
        node,
      )}</blockquote>`;
    case "codeBlock":
      return `<pre style="margin:0 0 18px;padding:14px;background:#f6f6f6;border-radius:6px;overflow:auto;font-size:14px;line-height:1.5;"><code>${esc(
        codeText(node),
      )}</code></pre>`;
    case "horizontalRule":
      return `<hr style="border:none;border-top:1px solid #eaeaea;margin:26px 0;"/>`;
    case "image":
      return node.attrs?.src
        ? `<img src="${esc(String(node.attrs.src))}" alt="" style="max-width:100%;height:auto;border-radius:6px;margin:0 0 18px;"/>`
        : "";
    default:
      return (node.content ?? []).map(renderBlock).join("");
  }
}

export function postToEmailHtml(
  content: unknown,
  opts: { title: string; postUrl: string; unsubscribeUrl: string },
): string {
  const doc = content as Node | null;
  const body =
    doc && doc.type === "doc" && doc.content?.length
      ? doc.content.map(renderBlock).join("")
      : "<p>(This post has no content yet.)</p>";

  return `<!doctype html>
<html>
  <head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
  <body style="margin:0;padding:0;background:#f4f4f5;">
    <div style="max-width:600px;margin:0 auto;padding:36px 26px;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <h1 style="margin:0 0 26px;font-size:30px;line-height:1.25;color:#111;">${esc(
        opts.title,
      )}</h1>
      ${body}
      <hr style="border:none;border-top:1px solid #eaeaea;margin:34px 0 20px;"/>
      <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#888;">
        You're receiving this because you subscribed to Gourav Boruah.
      </p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:#888;">
        <a href="${esc(
          opts.postUrl,
        )}" style="color:#888;">Read it on the site</a>
        &nbsp;·&nbsp;
        <a href="${esc(
          opts.unsubscribeUrl,
        )}" style="color:#888;">Unsubscribe</a>
      </p>
    </div>
  </body>
</html>`;
}
