import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = "https://personal-site-omega-neon.vercel.app";

type PublishedPost = { slug: string; published_at: string | null };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/products",
    "/writing",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
  }));

  // Include every published post so search engines can find them.
  const supabase = createClient();
  const { data } = await supabase.rpc("list_published_posts");
  const posts: MetadataRoute.Sitemap = ((data as PublishedPost[]) ?? []).map(
    (p) => ({
      url: `${SITE_URL}/writing/${p.slug}`,
      lastModified: p.published_at ? new Date(p.published_at) : new Date(),
      changeFrequency: "monthly",
    }),
  );

  return [...staticPages, ...posts];
}
