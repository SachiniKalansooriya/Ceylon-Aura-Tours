import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowRight, FiShield, FiClock, FiMap, FiUsers } from "react-icons/fi";
import PackageCard from "@/components/PackageCard";
import DestinationCard from "@/components/DestinationCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // revalidate every 60 seconds

async function getFeaturedPackages() {
  return prisma.package.findMany({
    where: { published: true, featured: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
  });
}

async function getFeaturedDestinations() {
  return prisma.destination.findMany({
    where: { published: true, featured: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
  });
}

export default async function HomePage() {
  const [packages, destinations] = await Promise.all([
    getFeaturedPackages(),
    getFeaturedDestinations(),
  ]);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Ceylon Paradise Tours";

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
        <div className="section-padding py-20 lg:py-32 relative">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Discover Sri Lanka,{" "}
              <span className="italic text-accent-300">Your Way</span>
            </h1>
            <p className="mt-6 text-lg text-primary-100 max-w-xl leading-relaxed">
              Private tours crafted around you. Choose your destinations, set
              your pace, and explore the pearl of the Indian Ocean with trusted
              local guides.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/packages" className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
                View Tour Packages
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'd like to plan a tour of Sri Lanka.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <FaWhatsapp className="w-5 h-5" />
                Plan on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-b border-gray-100">
        <div className="section-padding py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: FiShield, label: "Licensed & Registered", value: "100% Legit" },
              { icon: FiUsers, label: "Private Tours", value: "Just You" },
              { icon: FiClock, label: "WhatsApp Support", value: "24/7" },
              { icon: FiMap, label: "Destinations", value: "40+" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <item.icon className="w-6 h-6 text-primary-600" />
                <span className="font-bold text-gray-900">{item.value}</span>
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      {packages.length > 0 && (
        <section className="bg-gray-50">
          <div className="section-padding py-16 lg:py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-900">
                  Popular Tour Packages
                </h2>
                <p className="text-gray-500 mt-2">
                  Curated itineraries for every kind of traveler
                </p>
              </div>
              <Link
                href="/packages"
                className="hidden sm:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
              >
                View all tours <FiArrowRight />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
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
                />
              ))}
            </div>
            <div className="sm:hidden mt-8 text-center">
              <Link href="/packages" className="btn-outline">
                View all tours <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Destinations */}
      {destinations.length > 0 && (
        <section className="bg-white">
          <div className="section-padding py-16 lg:py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-900">
                  Top Destinations
                </h2>
                <p className="text-gray-500 mt-2">
                  From ancient ruins to pristine beaches
                </p>
              </div>
              <Link
                href="/destinations"
                className="hidden sm:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700"
              >
                View all destinations <FiArrowRight />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest) => (
                <DestinationCard
                  key={dest.id}
                  slug={dest.slug}
                  name={dest.name}
                  image={dest.image}
                  shortDesc={dest.shortDesc}
                  category={dest.category}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="bg-primary-50">
        <div className="section-padding py-16 lg:py-20">
          <h2 className="font-display text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Pick Your Destinations", desc: "Browse our destinations or tell us what interests you." },
              { step: "2", title: "Chat on WhatsApp", desc: "Send us your picks and travel dates. We'll craft a custom itinerary." },
              { step: "3", title: "Travel & Enjoy", desc: "Your private driver picks you up. Explore at your own pace." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white">
        <div className="section-padding py-16 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            Ready to Explore Sri Lanka?
          </h2>
          <p className="text-green-100 max-w-md mx-auto mb-8">
            Tell us your dream trip on WhatsApp. We reply within hours with a
            personalized itinerary and quote.
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'd like to plan a tour of Sri Lanka.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-50 transition shadow-lg"
          >
            <FaWhatsapp className="w-6 h-6" />
            Start Planning Now
          </a>
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            name: siteName,
            description:
              "Private, customizable tour packages in Sri Lanka. Visit Sigiriya, Kandy, Ella, Galle and more.",
            url: process.env.NEXT_PUBLIC_SITE_URL,
            areaServed: {
              "@type": "Country",
              name: "Sri Lanka",
            },
            priceRange: "$$",
          }),
        }}
      />
    </>
  );
}
