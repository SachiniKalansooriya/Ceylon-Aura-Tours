import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiShield,
  FiClock,
  FiMap,
  FiUsers,
  FiCompass,
  FiMessageCircle,
  FiSend,
  FiPlay,
} from "react-icons/fi";
import Image from "next/image";
import PackageCard from "@/components/PackageCard";
import DestinationCard from "@/components/DestinationCard";
import { prisma } from "@/lib/prisma";
import {
  HeroTitle,
  HeroSubtitle,
  HeroButtons,
  SectionReveal,
  StepItem,
  CTAReveal,
  AnimatedButton,
} from "@/components/motion/HomeAnimations";
import ScrollReveal from "@/components/motion/ScrollReveal";
import HeroVideo from "@/components/HeroVideo";
import StoryCarousel from "@/components/StoryCarousel";
import ReviewsSection from "@/components/ReviewsSection";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";

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

  const whatsappUrl = buildSimpleWhatsAppUrl("Hi! I'd like to plan a tour of Sri Lanka.");
  const siteName =
    process.env.NEXT_PUBLIC_SITE_NAME || "Ceylon Aura Travels";

  return (
    <>
      {/* ───── HERO — Full-screen video background ───── */}
      <section className="hero-video-container">
        {/* Video background */}
        <HeroVideo />

        {/* Dark overlay gradient */}
        <div className="hero-video-overlay" />

        {/* Hero content — centered */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="section-padding w-full">
            <div className="max-w-3xl mx-auto text-center">
              <HeroTitle>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 leading-[1.05] tracking-tight text-white text-balance">
  <span className="text-accent-400" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400 }}>
    Ayubowan
  </span>
  <br />
  <span className="text-3xl sm:text-4xl lg:text-5xl text-white">
    Discover Sri Lanka
  </span>
</h1>
              </HeroTitle>


              <HeroButtons className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <AnimatedButton
                  href="/packages"
                  className="inline-flex items-center gap-3 bg-white text-primary-950 px-8 py-4 rounded-full font-bold text-base hover:bg-accent-50 transition-all duration-300 shadow-2xl shadow-black/20 hover:-translate-y-0.5"
                >
                  <FiPlay className="w-4 h-4" />
                  Explore
                </AnimatedButton>
                <AnimatedButton
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass !px-8 !py-4"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Start on WhatsApp
                </AnimatedButton>
              </HeroButtons>
            </div>
          </div>
        </div>

        {/* Scroll indicator — glowing double chevron */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-0 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-90 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="-mt-3 opacity-50 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
            <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* ───── STORY CARDS — Glassy cards with images like srilanka.travel ───── */}
      <section className="bg-[#faf9f7]">
        <div className="section-padding section-spacing">
          <SectionReveal className="text-center mb-14">
            <span className="section-label">What&apos;s New</span>
            <h2 className="heading-section">
              Stories from Sri Lanka
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              Fresh stories. Timeless traditions. More of Sri Lanka.
            </p>
          </SectionReveal>

          <StoryCarousel />
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className="bg-white">
        <div className="section-padding section-spacing">
          <SectionReveal className="text-center mb-16">
            <span className="section-label">Simple Process</span>
            <h2 className="heading-section">
              Three Steps to Paradise
            </h2>
            <div className="divider mx-auto mt-4" />
          </SectionReveal>

          <div className="relative max-w-5xl mx-auto">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-accent-300 to-transparent" />

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  icon: FiCompass,
                  step: "01",
                  title: "Choose Destinations",
                  desc: "Browse our list or tell us your dream spots. Mix beaches, mountains, temples and wildlife.",
                },
                {
                  icon: FiMessageCircle,
                  step: "02",
                  title: "Chat & Customize",
                  desc: "Send your picks on WhatsApp. We'll build a day-by-day itinerary and give you a clear quote.",
                },
                {
                  icon: FiSend,
                  step: "03",
                  title: "Travel & Enjoy",
                  desc: "Your private driver meets you at the airport. Relax and explore at your own pace.",
                },
              ].map((item, i) => (
                <StepItem key={item.step} index={i} className="text-center relative">
                  <div className="w-14 h-14 bg-white border-2 border-accent-200 rounded-full flex items-center justify-center mx-auto mb-5 relative z-10 shadow-sm">
                    <item.icon className="w-6 h-6 text-primary-900" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-accent-500 mb-2 block">
                    Step {item.step}
                  </span>
                  <h3 className="heading-card mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                    {item.desc}
                  </p>
                </StepItem>
              ))}
            </div>
          </div>
        </div>
      </section>

    

      {/* ───── FEATURED PACKAGES ───── */}
      {packages.length > 0 && (
        <section className="bg-mesh-light">
          <div className="section-padding section-spacing">
            <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
              {/* Left — sticky heading */}
              <SectionReveal className="lg:sticky lg:top-32">
                <span className="section-label">Curated Itineraries</span>
                <h2 className="heading-section mb-4">
                  Popular Tour Packages
                </h2>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Each package is fully customizable. Pick one as a starting
                  point and we&apos;ll tailor it to your interests, budget and
                  travel dates.
                </p>
                <div className="divider mb-8" />
                <Link href="/packages" className="btn-primary">
                  View All Packages
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </SectionReveal>

              {/* Right — card grid */}
              <div className="grid sm:grid-cols-2 gap-5">
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
            </div>
          </div>
        </section>
      )}

      {/* ───── FEATURED DESTINATIONS ───── */}
      {destinations.length > 0 && (
        <section className="bg-white">
          <div className="section-padding section-spacing">
            <SectionReveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
              <div>
                <span className="section-label">Explore Sri Lanka</span>
                <h2 className="heading-section">
                  Must-Visit Destinations
                </h2>
              </div>
              <Link
  href="/destinations"
  className="inline-flex items-center gap-2 bg-primary-900 text-white font-semibold hover:bg-primary-950 transition-colors text-sm px-5 py-2.5 rounded-full"
>
  See all destinations <FiArrowUpRight className="w-4 h-4" />
</Link>
            </SectionReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

      {/* ───── GUEST REVIEWS ───── */}
      <ReviewsSection />

      {/* Spacer between sections */}
      <div className="h-16 sm:h-20 bg-[#faf9f7]" />

{/* ───── CTA — dark navy ───── */}
<section className="relative overflow-hidden">
  {/* Background image */}
  <div className="absolute inset-0">
    <Image
      src="/images/cta-bg.jpg"
      alt=""
      fill
      className="object-cover"
    />
    <div className="absolute inset-0 bg-primary-950/85" />
  </div>

  <CTAReveal className="section-padding py-24 lg:py-32 relative z-10">
    <div className="max-w-2xl mx-auto text-center">
      <span className="pill-white mb-6 inline-block">
        Free Quote — No Obligation
      </span>
      <h2 className="font-display text-4xl sm:text-5xl font-800 text-white mb-6 leading-tight">
        Ready to Explore?
      </h2>
      <p className="text-white/60 text-lg max-w-md mx-auto mb-10 font-light leading-relaxed">
        Tell us your dream trip on WhatsApp. We reply within hours with a
        personalized itinerary and clear pricing.
      </p>
      <AnimatedButton
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-accent-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-accent-600 transition-all duration-300 shadow-2xl shadow-accent-500/20 hover:-translate-y-0.5"
      >
        <FaWhatsapp className="w-6 h-6" />
        Start Planning Now
      </AnimatedButton>
    </div>
  </CTAReveal>
</section>



      {/* Spacer before footer */}
      <div className="h-16 sm:h-20 bg-[#faf9f7]" />

  {/* ───── TRUST BADGES — stat strip ───── */}
<section className="section-padding py-16">
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
    {[
      { icon: FiShield, value: "100%", label: "Licensed & Insured" },
      { icon: FiUsers, value: "Private", label: "Just Your Group" },
      { icon: FiClock, value: "24 / 7", label: "WhatsApp Support" },
      { icon: FiMap, value: "40+", label: "Destinations" },
    ].map((item, i) => (
      <ScrollReveal key={item.label} delay={0.1 * i} direction="up">
        <div className="bg-primary-950 rounded-2xl px-6 py-8 text-center">
          <item.icon className="w-6 h-6 text-accent-400 mx-auto mb-3" />
          <p className="font-display text-3xl font-800 text-white">
            {item.value}
          </p>
          <p className="text-sm text-white/40 mt-1">{item.label}</p>
        </div>
      </ScrollReveal>
    ))}
  </div>
</section>

      {/* Spacer before footer */}
      <div className="h-16 sm:h-20 bg-[#faf9f7]" />

      {/* JSON-LD */}
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
