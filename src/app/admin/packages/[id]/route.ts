import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params;
  const pkg = await prisma.package.findUnique({ where: { id } });
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(pkg);
}

export async function PUT(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const pkg = await prisma.package.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug,
      description: body.description,
      highlights: body.highlights,
      duration: body.duration,
      durationDays: body.durationDays,
      price: body.price,
      priceLabel: body.priceLabel,
      image: body.image,
      images: body.images || null,
      destinations: body.destinations,
      itinerary: body.itinerary,
      inclusions: body.inclusions,
      exclusions: body.exclusions,
      seoTitle: body.seoTitle || null,
      seoDesc: body.seoDesc || null,
      featured: body.featured,
      published: body.published,
    },
  });

  return NextResponse.json(pkg);
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const pkg = await prisma.package.update({ where: { id }, data: body });
  return NextResponse.json(pkg);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.package.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
