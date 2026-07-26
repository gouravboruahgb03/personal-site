import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// The magic link points here with a one-time `code`. We exchange it for a
// real session (sets the auth cookie), then send the reader on their way.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong (expired/invalid link)
  return NextResponse.redirect(`${origin}/login?error=Could not sign you in`);
}
