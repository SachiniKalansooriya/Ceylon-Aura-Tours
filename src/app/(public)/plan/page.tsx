import { Metadata } from "next";
import PlanBuilder from "@/components/PlanBuilder";
import PageHero from "@/components/PageHero";
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
    <div className="min-h-screen">
      <PageHero
        label="Build Your Tour"
        title="Plan Your Trip"
        description="Select the destinations you want to visit, choose your dates, and send your wishlist to us on WhatsApp. We'll reply with a custom itinerary and quote."
      />

      <div className="section-padding py-12 lg:py-16">
        <PlanBuilder destinations={destinations} />
      </div>
    </div>
  );
}
