/** Shared helpers for metadata, canonical URLs and structured data (JSON-LD). */

export const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Ceylon Elephant Tours";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

/** Image used when a page has no image of its own (social share previews). */
export const defaultShareImage = "/images/cta-bg.jpg";
export const logoPath = "/images/ceylon_elephant_tours_logo.png";

/** Turns a relative path or Cloudinary URL into an absolute URL. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${siteUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/** One-line description of at most `max` characters, cut at a word boundary. */
export function metaDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–-]+$/, "")}…`;
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Serialises JSON-LD safely for a <script> tag (escapes "<" so content can't close the tag). */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
