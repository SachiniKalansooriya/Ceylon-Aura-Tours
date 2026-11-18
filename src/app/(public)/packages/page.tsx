import { Metadata } from "next";
import PackageCard from "@/components/PackageCard";
import PageHero from "@/components/PageHero";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tour Packages | Sri Lanka Private Tours",
  description:
    "Browse our curated Sri Lanka tour packages. From 3-day getaways to 14-day adventures. Private vehicles, trusted drivers, customizable itineraries.",
  alternates: { canonical: "/packages" },
};

export const revalidate = 60;

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="min-h-screen">
      <PageHero
        label="Curated Itineraries"
        title="Tour Packages"
        description="Choose from our carefully crafted itineraries, or use them as a starting point for your perfect Sri Lanka adventure. Every tour is private and customizable."
        height="70vh"
      />

      <div className="section-padding section-spacing">
        {packages.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-3xl border border-gray-100 bg-gray-50">
            <p className="text-xl mb-2 text-gray-500">No packages available yet</p>
            <p className="text-sm text-gray-400">Check back soon for new tours!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {packages.map((pkg: any, i: number) => (
              <PackageCard
                key={pkg.id}
                slug={pkg.slug}
                title={pkg.title}
                image={pkg.image}
                duration={pkg.duration}
                durationDays={pkg.durationDays}
                price={pkg.price}
                priceLabel={pkg.priceLabel}
                destinations={pkg.destinations}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
