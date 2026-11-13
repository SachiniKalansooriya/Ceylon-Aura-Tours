import { Metadata } from "next";
import DestinationCard from "@/components/DestinationCard";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/motion/PageTransition";
import ScrollReveal from "@/components/motion/ScrollReveal";

export const metadata: Metadata = {
  title: "Destinations | Explore Sri Lanka",
  description:
    "Explore 40+ destinations across Sri Lanka. Ancient temples, wildlife safaris, pristine beaches, misty hill country, colonial forts and more.",
};

export const revalidate = 60;

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  // Group by category
  const grouped: Record<string, any[]> = {};
  destinations.forEach((dest: any) => {
    if (!grouped[dest.category]) grouped[dest.category] = [];
    grouped[dest.category].push(dest);
  });

  return (
    <div className="bg-mesh-light min-h-screen">
      <div className="section-padding py-12 lg:py-16">
        <PageHeader className="mb-10">
          <h1 className="font-display text-4xl font-bold text-gray-900">
            Destinations
          </h1>
          <p className="text-gray-500 mt-3 max-w-2xl">
            Sri Lanka packs an incredible variety into a small island. From UNESCO
            World Heritage sites to untouched beaches, discover the destinations
            that make this island unforgettable.
          </p>
        </PageHeader>

        {Object.keys(grouped).length === 0 ? (
          <div className="glass-card text-center py-20 px-6">
            <p className="text-xl mb-2 text-gray-500">No destinations available yet</p>
            <p className="text-sm text-gray-400">Check back soon!</p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, dests]: [string, any[]]) => (
            <div key={category} className="mb-12">
              <ScrollReveal>
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
                  {category}
                </h2>
              </ScrollReveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dests.map((dest: any, i: number) => (
                  <DestinationCard
                    key={dest.id}
                    slug={dest.slug}
                    name={dest.name}
                    image={dest.image}
                    shortDesc={dest.shortDesc}
                    category={dest.category}
                    index={i}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
