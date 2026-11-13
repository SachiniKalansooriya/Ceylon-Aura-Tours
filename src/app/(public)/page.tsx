import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowRight, FiShield, FiClock, FiMap, FiUsers } from "react-icons/fi";
import PackageCard from "@/components/PackageCard";
import DestinationCard from "@/components/DestinationCard";
import { prisma } from "@/lib/prisma";
import {
  HeroTitle,
  HeroSubtitle,
  HeroButtons,
  FloatingCircle,
  TrustBadges,
  TrustBadgeItem,
  SectionReveal,
  StepItem,
  CTAReveal,
  AnimatedButton,
} from "@/components/motion/HomeAnimations";

export const revalidate = 60;

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
      <section className="relative bg-mesh-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5" />
        {/* Animated decorative glass circles */}
        <FloatingCircle
          className="absolute top-20 right-10 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl"
          delay={0}
        />
        <FloatingCircle
          className="absolute bottom-10 left-20 w-48 h-48 bg-coral-400/10 rounded-full blur-3xl"
          delay={2}
        />
        <FloatingCircle
          className="absolute top-1/2 left-1/2 w-32 h-32 bg-accent-400/8 rounded-full blur-2xl"
          delay={4}
        />
        <div className="section-padding py-24 lg:py-36 relative">
          <div className="max-w-3xl">
            <HeroTitle>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Discover Sri Lanka,{" "}
                <span className="italic text-gradient">Your Way</span>
              </h1>
            </HeroTitle>
            <HeroSubtitle className="mt-6">
              <p className="text-lg text-primary-100/90 max-w-xl leading-relaxed">
                Private tours crafted around you. Choose your destinations, set
                your pace, and explore the pearl of the Indian Ocean with trusted
                local guides.
              </p>
            </HeroSubtitle>
            <HeroButtons className="mt-8 flex flex-wrap gap-4">
              <AnimatedButton className="btn-glass">
                <Link href="/packages" className="flex items-center gap-2">
                  View Tour Packages
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </AnimatedButton>
              <AnimatedButton
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'd like to plan a tour of Sri Lanka.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <FaWhatsapp className="w-5 h-5" />
                Plan on WhatsApp
              </AnimatedButton>
            </HeroButtons>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="relative -mt-8 z-10">
        <div className="section-padding">
          <TrustBadges className="glass rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: FiShield, label: "Licensed & Registered", value: "100% Legit" },
                { icon: FiUsers, label: "Private Tours", value: "Just You" },
                { icon: FiClock, label: "WhatsApp Support", value: "24/7" },
                { icon: FiMap, label: "Destinations", value: "40+" },
              ].map((item, i) => (
                <TrustBadgeItem key={item.label} index={i} className="flex flex-col items-center gap-2">
                  <div className="bg-primary-100/60 p-3 rounded-full">
                    <item.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="font-bold text-gray-900">{item.value}</span>
                  <span className="text-xs text-gray-500">{item.label}</span>
                </TrustBadgeItem>
              ))}
            </div>
          </TrustBadges>
        </div>
      </section>

      {/* Featured Packages */}
      {packages.length > 0 && (
        <section className="bg-mesh-light">
          <div className="section-padding py-16 lg:py-20">
            <SectionReveal className="flex items-end justify-between mb-10">
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
                className="hidden sm:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                View all tours <FiArrowRight />
              </Link>
            </SectionReveal>
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
        <section>
          <div className="section-padding py-16 lg:py-20">
            <SectionReveal className="flex items-end justify-between mb-10">
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
                className="hidden sm:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                View all destinations <FiArrowRight />
              </Link>
            </SectionReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest: any, i: number) => (
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
        </section>
      )}

      {/* How It Works */}
      <section>
        <div className="section-padding py-16 lg:py-20">
          <SectionReveal className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900">
              How It Works
            </h2>
          </SectionReveal>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Pick Your Destinations", desc: "Browse our destinations or tell us what interests you." },
              { step: "2", title: "Chat on WhatsApp", desc: "Send us your picks and travel dates. We'll craft a custom itinerary." },
              { step: "3", title: "Travel & Enjoy", desc: "Your private driver picks you up. Explore at your own pace." },
            ].map((item, i) => (
              <StepItem key={item.step} index={i} className="text-center">
                <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg shadow-primary-500/25 rotate-3 hover:rotate-0 transition-transform duration-300">
                  {item.step}
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </StepItem>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="bg-mesh-hero">
          <FloatingCircle className="absolute top-0 right-0 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl" delay={1} />
          <FloatingCircle className="absolute bottom-0 left-0 w-56 h-56 bg-coral-400/15 rounded-full blur-3xl" delay={3} />
          <CTAReveal className="section-padding py-20 text-center relative">
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Ready to Explore Sri Lanka?
            </h2>
            <p className="text-primary-200/80 max-w-md mx-auto mb-8">
              Tell us your dream trip on WhatsApp. We reply within hours with a
              personalized itinerary and quote.
            </p>
            <AnimatedButton
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'd like to plan a tour of Sri Lanka.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/25 hover:border-white/40 transition-all duration-300 shadow-xl"
            >
              <FaWhatsapp className="w-6 h-6" />
              Start Planning Now
            </AnimatedButton>
          </CTAReveal>
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
