import { siteUrl } from "@/lib/site";

export default function sitemap() {
  return [{ url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 }];
}
