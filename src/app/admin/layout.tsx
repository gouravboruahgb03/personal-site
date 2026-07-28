import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/admin/AdminNav";

// The admin area must never be indexed by search engines.
export const metadata = {
  robots: { index: false, follow: false },
};

// This layout wraps EVERY page under /admin. It is a Server Component, so this
// code runs on the server for every single /admin request — it can never be
// skipped or tampered with from the browser.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  // 1. Who is this? getUser() re-validates the token WITH Supabase's auth
  //    server — it doesn't just trust a cookie. No valid user -> to /login.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. What is their role? Look it up fresh in the database every time.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // 3. Only admins pass. A reader (or anyone else) is turned away before any
  //    admin content is ever rendered or sent to the browser.
  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
