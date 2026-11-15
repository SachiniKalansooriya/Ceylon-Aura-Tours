import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const reviews = await prisma.review.findMany({
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
