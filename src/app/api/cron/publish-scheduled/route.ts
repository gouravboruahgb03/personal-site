import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendToWebhook, type CrosspostPost } from "@/lib/crosspost";

export const dynamic = "force-dynamic";

// Called on a schedule by an external pinger (cron-job.org / Make / Vercel Cron).
// Publishes any 'scheduled' post whose time has arrived, then cross-posts the
// ones that asked to be shared.
export async function GET(request: Request) {
  // Protect the endpoint: caller must pass the secret
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  const urlSecret = new URL(request.url).searchParams.get("secret");
  if (secret && auth !== `Bearer ${secret}` && urlSecret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient();

  // SECURITY DEFINER function flips due 'scheduled' posts to 'published'
  // and returns the rows it published.
  const { data, error } = await supabase.rpc("publish_due_posts");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const posts = (data ?? []) as (CrosspostPost & { crosspost: boolean })[];

  let shared = 0;
  for (const post of posts) {
    if (post.crosspost) {
      try {
        await sendToWebhook(post);
        shared += 1;
      } catch {
        // Don't fail the whole run if one webhook call fails
      }
    }
  }

  return NextResponse.json({ published: posts.length, shared });
}
