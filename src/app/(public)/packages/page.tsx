import { Metadata } from "next";
import PackageCard from "@/components/PackageCard";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/motion/PageTransition";

export const metadata: Metadata = {
  title: "Tour Packages | Sri Lanka Private Tours",
  description:
    "Browse our curated Sri Lanka tour packages. From 3-day getaways to 14-day adventures. Private vehicles, trusted drivers, customizable itineraries.",
};

export const revalidate = 60;

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="bg-mesh-light min-h-screen">
      <div className="section-padding py-12 lg:py-16">
        <PageHeader className="mb-10">
          <h1 className="font-display text-4xl font-bold text-gray-900">
            Tour Packages
          </h1>
          <p className="text-gray-500 mt-3 max-w-2xl">
            Choose from our carefully crafted itineraries, or use them as a
            starting point for your perfect Sri Lanka adventure. Every tour is
            private and customizable.
          </p>
        </PageHeader>

        {packages.length === 0 ? (
          <div className="glass-card text-center py-20 px-6">
            <p className="text-xl mb-2 text-gray-500">No packages available yet</p>
            <p className="text-sm text-gray-400">Check back soon for new tours!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
