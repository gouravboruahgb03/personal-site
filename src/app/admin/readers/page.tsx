import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Readers" };
export const dynamic = "force-dynamic";

type Reader = {
  name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function ReadersPage() {
  const supabase = createClient();
  const { data, count, error } = await supabase
    .from("profiles")
    .select("name, email, phone, created_at", { count: "exact" })
    .eq("role", "reader")
    .order("created_at", { ascending: false });

  const readers = (data ?? []) as Reader[];

  return (
    <section className="mx-auto max-w-content px-6 py-16 md:px-10">
      <p className="eyebrow">Readers</p>
      <div className="mt-4 flex items-baseline gap-4">
        <h1 className="h-section">Your list</h1>
        <span className="text-2xl font-bold text-faint">
          {count ?? readers.length}
        </span>
      </div>
      <p className="subhead mt-3">
        Everyone who has signed up to read your members-only posts.
      </p>

      {error && (
        <p className="mt-8 text-red-400">
          Couldn&apos;t load readers: {error.message}
        </p>
      )}

      {!error && readers.length === 0 && (
        <p className="mt-10 text-muted">No readers have signed up yet.</p>
      )}

      {readers.length > 0 && (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-rule text-faint">
                <th className="py-3 pr-6 font-normal">Name</th>
                <th className="py-3 pr-6 font-normal">Email</th>
                <th className="py-3 pr-6 font-normal">Phone</th>
                <th className="py-3 font-normal">Signed up</th>
              </tr>
            </thead>
            <tbody>
              {readers.map((r, i) => (
                <tr key={i} className="border-b border-rule/50 text-white">
                  <td className="py-3 pr-6">{r.name || "—"}</td>
                  <td className="py-3 pr-6">{r.email || "—"}</td>
                  <td className="py-3 pr-6">{r.phone || "—"}</td>
                  <td className="py-3 text-muted">{formatDate(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
