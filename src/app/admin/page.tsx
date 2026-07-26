import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export const metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="mx-auto max-w-content px-6 py-24 md:px-10 md:py-32">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Admin</p>
        <SignOutButton />
      </div>

      <h1 className="h-section mt-6">Dashboard</h1>
      <p className="subhead mt-4">
        You&apos;re signed in as an admin ({user?.email}).
      </p>

      <p className="prose-post mt-10">
        This is your private admin area. Only a logged-in user whose profile role
        is <strong>admin</strong> can see this page. We&apos;ll build the
        post-writing and product tools here next.
      </p>
    </section>
  );
}
