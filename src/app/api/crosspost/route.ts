import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendToWebhook, type CrosspostPost } from "@/lib/crosspost";

export async function POST(request: Request) {
  const supabase = createClient();

  // Admin only
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

  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "Missing post id" }, { status: 400 });
  }

  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, slug, cover_image, content, published_at")
    .eq("id", id)
    .single();
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  try {
    await sendToWebhook(post as CrosspostPost);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Webhook failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
