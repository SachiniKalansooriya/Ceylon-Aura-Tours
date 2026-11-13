import { Metadata } from "next";
import PlanBuilder from "@/components/PlanBuilder";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Plan Your Trip | Build Your Custom Sri Lanka Tour",
  description:
    "Select your dream destinations and get a personalized Sri Lanka tour quote via WhatsApp. Pick from 40+ destinations across culture, wildlife, beaches and more.",
};

export const revalidate = 60;

export default async function PlanPage() {
  const destinations = await prisma.destination.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    select: { name: true, slug: true, category: true },
  });

  return (
    <div className="bg-mesh-light min-h-screen">
      <div className="section-padding py-12 lg:py-16">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold text-gray-900">
            Plan Your Trip
          </h1>
          <p className="text-gray-500 mt-3 max-w-2xl">
            Select the destinations you want to visit, choose your dates, and send
            your wishlist to us on WhatsApp. We&apos;ll reply with a custom
            itinerary and quote.
          </p>
        </div>

        <PlanBuilder destinations={destinations} />
      </div>
    </div>
  );
}
