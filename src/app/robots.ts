import type { MetadataRoute } from "next";

const SITE_URL = "https://personal-site-omega-neon.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep private/utility routes out of search results.
      disallow: ["/admin", "/api", "/login", "/signup", "/unsubscribe"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
