import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { checkFeaturedLimit } from "@/lib/featured";

export async function GET() {
  const packages = await prisma.package.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(packages);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const limitError = await checkFeaturedLimit("package", body.featured);
  if (limitError) return limitError;

  const pkg = await prisma.package.create({
    data: {
      title: body.title,
      slug: body.slug,
      description: body.description,
      highlights: body.highlights || "[]",
      duration: body.duration,
      durationDays: body.durationDays,
      price: body.price,
      priceLabel: body.priceLabel,
      image: body.image || null,
      images: body.images || null,
      destinations: body.destinations || "[]",
      itinerary: body.itinerary || "[]",
      inclusions: body.inclusions || "[]",
      exclusions: body.exclusions || "[]",
      seoTitle: body.seoTitle || null,
      seoDesc: body.seoDesc || null,
      featured: body.featured || false,
      published: body.published ?? true,
      sortOrder: body.sortOrder || 0,
    },
  });

  return NextResponse.json(pkg, { status: 201 });
}
