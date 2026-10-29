import { siteUrl } from "@/lib/site";

export default function sitemap() {
  if (!siteUrl) return [];
  return [{ url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 }];
}
