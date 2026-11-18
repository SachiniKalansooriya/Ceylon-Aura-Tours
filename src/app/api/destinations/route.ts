import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { checkFeaturedLimit } from "@/lib/featured";

export async function GET() {
  const destinations = await prisma.destination.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(destinations);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const limitError = await checkFeaturedLimit("destination", body.featured);
  if (limitError) return limitError;

  const dest = await prisma.destination.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      shortDesc: body.shortDesc || null,
      image: body.image || null,
      images: body.images || null,
      category: body.category,
      highlights: body.highlights || "[]",
      seoTitle: body.seoTitle || null,
      seoDesc: body.seoDesc || null,
      featured: body.featured || false,
      published: body.published ?? true,
      sortOrder: body.sortOrder || 0,
    },
  });

  return NextResponse.json(dest, { status: 201 });
}
