import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiCheck, FiX, FiArrowLeft } from "react-icons/fi";
import { prisma } from "@/lib/prisma";
import { parseJSON, formatPrice } from "@/lib/helpers";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPackage(slug: string) {
  return prisma.package.findUnique({ where: { slug, published: true } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) return {};
  return {
    title: pkg.seoTitle || `${pkg.title} | Tour Package`,
    description: pkg.seoDesc || pkg.description.slice(0, 160),
  };
}

export async function generateStaticParams() {
  const packages = await prisma.package.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return packages.map((p: { slug: string }) => ({ slug: p.slug }));
}

export const revalidate = 60;

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) notFound();

  const destinations = parseJSON<string[]>(pkg.destinations, []);
  const highlights = parseJSON<string[]>(pkg.highlights, []);
  const itinerary = parseJSON<{ day: string; title: string; description: string }[]>(pkg.itinerary, []);
  const inclusions = parseJSON<string[]>(pkg.inclusions, []);
  const exclusions = parseJSON<string[]>(pkg.exclusions, []);

  const whatsappUrl = buildWhatsAppUrl(destinations, undefined, undefined, undefined, pkg.title);

  return (
    <div className="bg-mesh-light min-h-screen">
      <div className="section-padding py-8 lg:py-12">
        {/* Breadcrumb */}
        <Link
          href="/packages"
          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 mb-6 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          All Tour Packages
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            {pkg.image && (
              <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8 shadow-xl">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {pkg.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                {pkg.duration}
              </span>
              <span className="text-primary-700 font-bold text-lg">
                {formatPrice(pkg.price, pkg.priceLabel)}
              </span>
            </div>

            {/* Destinations */}
            {destinations.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {destinations.map((d) => (
                  <span
                    key={d}
                    className="bg-primary-500/10 text-primary-700 text-sm px-3 py-1 rounded-full border border-primary-400/20"
                  >
                    {d}
                  </span>
                ))}
              </div>
            )}

            <div className="glass-card p-6 mb-10">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {pkg.description}
              </p>
            </div>

            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="mb-10">
                <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
                  Tour Highlights
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <FiCheck className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <div className="mb-10">
                <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
                  Day-by-Day Itinerary
                </h2>
                <div className="space-y-4">
                  {itinerary.map((day, i) => (
                    <div
                      key={i}
                      className="glass-card p-5"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-md shadow-primary-500/25">
                          {day.day}
                        </span>
                        <h3 className="font-semibold text-gray-900">
                          {day.title}
                        </h3>
                      </div>
                      <p className="text-gray-500 text-sm ml-11">
                        {day.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions / Exclusions */}
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {inclusions.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Included</h3>
                  <ul className="space-y-2">
                    {inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <FiCheck className="w-4 h-4 text-green-500 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {exclusions.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Not Included</h3>
                  <ul className="space-y-2">
                    {exclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <FiX className="w-4 h-4 text-red-400 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 glass-card p-6">
              <h3 className="font-display text-lg font-bold text-gray-900 mb-2">
                Interested in this tour?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Send us a message on WhatsApp and we&apos;ll get back to you with a
                personalized quote.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-whatsapp justify-center"
              >
                <FaWhatsapp className="w-5 h-5" />
                Inquire on WhatsApp
              </a>
              <p className="text-xs text-gray-400 text-center mt-3">
                We typically reply within a few hours
              </p>
            </div>
          </div>
        </div>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TouristTrip",
              name: pkg.title,
              description: pkg.description,
              touristType: "Leisure",
              offers: pkg.price
                ? {
                    "@type": "Offer",
                    price: pkg.price,
                    priceCurrency: "USD",
                  }
                : undefined,
            }),
          }}
        />
      </div>
    </div>
  );
}
