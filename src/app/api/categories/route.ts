import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { toSlug } from "@/lib/category-slug";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const name = String(body.name ?? "").trim().slice(0, 100);
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) return NextResponse.json({ error: "Category already exists" }, { status: 409 });

  const slug = toSlug(String(body.slug ?? "").trim() || name).slice(0, 100);
  if (!slug) return NextResponse.json({ error: "Slug must contain letters or numbers" }, { status: 400 });
  const slugTaken = await prisma.category.findUnique({ where: { slug } });
  if (slugTaken) {
    return NextResponse.json({ error: `The slug "${slug}" is already used by "${slugTaken.name}"` }, { status: 409 });
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description: String(body.description ?? "").trim().slice(0, 500) || null,
      image: body.image || null,
      sortOrder: Number(body.sortOrder) || 0,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
