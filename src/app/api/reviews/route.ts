import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

/**
 * Public: the latest reviews that are switched on.
 * Admin (?all=1 with a session): every review, including hidden ones.
 */
export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get("all") === "1") {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(reviews);
  }

  const reviews = await prisma.review.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, country, comment, rating } = body;

  if (!name || !country || !comment) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const parsedRating = Number(rating);
  const safeRating = Number.isInteger(parsedRating) && parsedRating >= 1 && parsedRating <= 5
    ? parsedRating
    : 5;

  const review = await prisma.review.create({
    data: {
      name: String(name).slice(0, 100),
      country: String(country).slice(0, 100),
      comment: String(comment).slice(0, 1000),
      rating: safeRating,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
