import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/dashboard/", "/en/dashboard", "/en/dashboard/"],
      },
    ],
    sitemap: "https://mtltrades.com/sitemap.xml",
    host: "https://mtltrades.com",
  };
}
