import { Metadata } from "next";
import DestinationCard from "@/components/DestinationCard";
import { prisma } from "@/lib/prisma";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { categorySlug, toSlug } from "@/lib/category-slug";

export const metadata: Metadata = {
  title: "Destinations | Explore Sri Lanka",
  description:
    "Explore 40+ destinations across Sri Lanka. Ancient temples, wildlife safaris, pristine beaches, misty hill country, colonial forts and more.",
  alternates: { canonical: "/destinations" },
};

export const revalidate = 60;

export default async function DestinationsPage() {
  const [destinations, categories] = await Promise.all([
    prisma.destination.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.category.findMany({ select: { name: true, slug: true } }),
  ]);
  const slugByName = new Map(categories.map((c) => [c.name, categorySlug(c)]));

  const grouped: Record<string, any[]> = {};
  destinations.forEach((dest: any) => {
    if (!grouped[dest.category]) grouped[dest.category] = [];
    grouped[dest.category].push(dest);
  });

  return (
    <div className="min-h-screen">
      <PageHero
        label="Explore Sri Lanka"
        title="Destinations"
        description="Sri Lanka packs an incredible variety into a small island. From UNESCO World Heritage sites to untouched beaches, discover what makes this island unforgettable."
      />

      <div className="section-padding section-spacing">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20 px-6 rounded-3xl border border-gray-100 bg-gray-50">
            <p className="text-xl mb-2 text-gray-500">No destinations available yet</p>
            <p className="text-sm text-gray-400">Check back soon!</p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, dests]: [string, any[]]) => (
            <div key={category} id={slugByName.get(category) ?? toSlug(category)} className="mb-16 scroll-mt-28">
              <ScrollReveal>
                <h2 className="heading-section text-2xl mb-2">{category}</h2>
                <div className="divider mb-8" />
              </ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
