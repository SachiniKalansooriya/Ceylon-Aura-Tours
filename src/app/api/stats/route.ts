import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [packages, destinations, inquiries] = await Promise.all([
    prisma.package.count(),
    prisma.destination.count(),
    prisma.inquiry.count(),
  ]);

  return NextResponse.json({ packages, destinations, inquiries });
}
