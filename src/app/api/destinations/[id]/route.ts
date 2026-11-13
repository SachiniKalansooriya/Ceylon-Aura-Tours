import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params;
  const dest = await prisma.destination.findUnique({ where: { id } });
  if (!dest) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(dest);
}

export async function PUT(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const dest = await prisma.destination.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      shortDesc: body.shortDesc,
      image: body.image,
      category: body.category,
      highlights: body.highlights,
      seoTitle: body.seoTitle || null,
      seoDesc: body.seoDesc || null,
      featured: body.featured,
      published: body.published,
    },
  });

  return NextResponse.json(dest);
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const dest = await prisma.destination.update({ where: { id }, data: body });
  return NextResponse.json(dest);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.destination.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
