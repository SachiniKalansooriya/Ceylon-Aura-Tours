import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

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

  const category = await prisma.category.create({
    data: {
      name,
      description: String(body.description ?? "").trim().slice(0, 500) || null,
      image: body.image || null,
      sortOrder: Number(body.sortOrder) || 0,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
