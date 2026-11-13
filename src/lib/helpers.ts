export function parseJSON<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

export function formatPrice(price: number | null, label?: string | null): string {
  if (price === null || price === undefined) return "Contact for price";
  return `From US$ ${price}${label ? ` ${label}` : ""}`;
}
