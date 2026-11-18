import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MAX_FEATURED } from "@/lib/featured-limit";

export { MAX_FEATURED };

/**
 * Returns a 409 response if turning `featured` on would exceed the homepage limit,
 * otherwise null. Items that are already featured can always be saved.
 */
export async function checkFeaturedLimit(
  model: "package" | "destination",
  wantsFeatured: unknown,
  id?: string
): Promise<NextResponse | null> {
  if (wantsFeatured !== true) return null;

  const delegate = model === "package" ? prisma.package : prisma.destination;

  if (id) {
    const current = await (delegate as typeof prisma.package).findUnique({
      where: { id },
      select: { featured: true },
    });
    if (current?.featured) return null;
  }

  const count = await (delegate as typeof prisma.package).count({ where: { featured: true } });
  if (count >= MAX_FEATURED) {
    const label = model === "package" ? "packages" : "destinations";
    return NextResponse.json(
      { error: `Only ${MAX_FEATURED} ${label} can be featured on the homepage. Remove one first.` },
      { status: 409 }
    );
  }
  return null;
}
