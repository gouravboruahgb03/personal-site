import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { postToEmailHtml } from "@/lib/postToEmailHtml";

export const dynamic = "force-dynamic";

const SITE_URL = "https://personal-site-omega-neon.vercel.app";

type Recipient = {
  name: string | null;
  email: string;
  unsubscribe_token: string;
};

// Send a published post to subscribers as an email newsletter (via Resend).
// Body: { postId: string, testOnly?: boolean }
export async function POST(request: Request) {
  const supabase = createClient();

  // --- Admin only ---
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email isn't set up yet (missing RESEND_API_KEY)." },
      { status: 500 },
    );
  }
  const from = process.env.NEWSLETTER_FROM ?? "Gourav Boruah <onboarding@resend.dev>";

  const { postId, testOnly } = (await request.json()) as {
    postId?: string;
    testOnly?: boolean;
  };
  if (!postId) {
    return NextResponse.json({ error: "Missing post id" }, { status: 400 });
  }

  // --- Fetch the post ---
  const { data: post } = await supabase
    .from("posts")
    .select("title, slug, content, status")
    .eq("id", postId)
    .single();
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  if (post.status !== "published") {
    return NextResponse.json(
      { error: "Publish the post before emailing it." },
      { status: 400 },
    );
  }

  // --- Work out who receives it ---
  let recipients: Recipient[];
  if (testOnly) {
    const { data: me } = await supabase
      .from("profiles")
      .select("name, email, unsubscribe_token")
      .eq("id", user.id)
      .single();
    recipients = [
      {
        name: me?.name ?? null,
        email: user.email as string,
        unsubscribe_token: me?.unsubscribe_token as string,
      },
    ];
  } else {
    const { data: subs, error } = await supabase
      .from("profiles")
      .select("name, email, unsubscribe_token")
      .eq("role", "reader")
      .eq("subscribed", true);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    recipients = (subs ?? []) as Recipient[];
  }

  if (recipients.length === 0) {
    return NextResponse.json({ sent: 0, total: 0 });
  }

  const subject = post.title || "New post";
  const postUrl = `${SITE_URL}/writing/${post.slug}`;

  // Build one email per recipient (each gets their own unsubscribe link).
  const emails = recipients.map((r) => ({
    from,
    to: [r.email],
    subject,
    html: postToEmailHtml(post.content, {
      title: post.title || "New post",
      postUrl,
      unsubscribeUrl: `${SITE_URL}/unsubscribe?token=${r.unsubscribe_token}`,
    }),
  }));

  // Resend's batch endpoint takes up to 100 emails at a time.
  let sent = 0;
  const failures: string[] = [];
  for (let i = 0; i < emails.length; i += 100) {
    const chunk = emails.slice(i, i + 100);
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chunk),
    });
    if (res.ok) {
      sent += chunk.length;
    } else {
      failures.push(await res.text());
    }
  }

  if (sent === 0) {
    return NextResponse.json(
      { error: failures[0] || "Sending failed.", sent, total: recipients.length },
      { status: 502 },
    );
  }

  return NextResponse.json({ sent, total: recipients.length, failures });
}
