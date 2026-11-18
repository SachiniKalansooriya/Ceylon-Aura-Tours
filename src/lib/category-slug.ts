import slugify from "slugify";

/** Normalises any text into a URL-safe slug ("Wildlife & Safari" → "wildlife-and-safari"). */
export function toSlug(text: string): string {
  return slugify(text, { lower: true, strict: true });
}

/** A category's slug, falling back to one made from its name for older rows without a slug. */
export function categorySlug(category: { name: string; slug?: string | null }): string {
  return category.slug || toSlug(category.name);
}
