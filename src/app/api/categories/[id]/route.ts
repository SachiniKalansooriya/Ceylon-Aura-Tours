import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { toSlug } from "@/lib/category-slug";

interface Props {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const name = String(body.name ?? "").trim().slice(0, 100);
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const current = await prisma.category.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (name !== current.name) {
    const clash = await prisma.category.findUnique({ where: { name } });
    if (clash) return NextResponse.json({ error: "Category already exists" }, { status: 409 });
  }

  const slug = toSlug(String(body.slug ?? "").trim() || name).slice(0, 100);
  if (!slug) return NextResponse.json({ error: "Slug must contain letters or numbers" }, { status: 400 });
  if (slug !== current.slug) {
    const slugTaken = await prisma.category.findUnique({ where: { slug } });
    if (slugTaken && slugTaken.id !== id) {
      return NextResponse.json({ error: `The slug "${slug}" is already used by "${slugTaken.name}"` }, { status: 409 });
    }
  }

  // Destinations store the category by name, so rename them along with it.
  const [category] = await prisma.$transaction([
    prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: String(body.description ?? "").trim().slice(0, 500) || null,
        image: body.image || null,
      },
    }),
    prisma.destination.updateMany({
      where: { category: current.name },
      data: { category: name },
    }),
  ]);

  return NextResponse.json(category);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const inUse = await prisma.destination.count({ where: { category: category.name } });
  if (inUse > 0) {
    return NextResponse.json(
      { error: `Category is used by ${inUse} destination${inUse === 1 ? "" : "s"}. Reassign them first.` },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
