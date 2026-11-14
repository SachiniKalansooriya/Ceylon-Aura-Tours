import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowLeft, FiCheck, FiArrowUpRight } from "react-icons/fi";
import { prisma } from "@/lib/prisma";
import { parseJSON } from "@/lib/helpers";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getDestination(slug: string) {
  return prisma.destination.findUnique({ where: { slug, published: true } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = await getDestination(slug);
  if (!dest) return {};
  return {
    title: dest.seoTitle || `${dest.name} | Destination Guide`,
    description: dest.seoDesc || dest.description.slice(0, 160),
  };
}

export async function generateStaticParams() {
  const destinations = await prisma.destination.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return destinations.map((d: { slug: string }) => ({ slug: d.slug }));
}

export const revalidate = 60;

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const dest = await getDestination(slug);
  if (!dest) notFound();

  const highlights = parseJSON<string[]>(dest.highlights, []);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! I'd like to visit ${dest.name} in Sri Lanka. Can you help me plan?`)}`;

  // Get packages that include this destination
  const relatedPackages = await prisma.package.findMany({
    where: { published: true, destinations: { contains: dest.name } },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* ───── Hero Section ───── */}
      <section className="relative h-[50vh] sm:h-[55vh] lg:h-[60vh] overflow-hidden">
        {/* Background image from admin */}
        <div className="absolute inset-0 bg-primary-950">
          {dest.image ? (
            <Image
              src={dest.image}
              alt={dest.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-900 to-primary-950" />
          )}
        </div>

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,22,40,0.9) 0%, rgba(15,30,55,0.6) 40%, rgba(20,40,70,0.3) 70%, rgba(30,58,95,0.2) 100%)",
          }}
        />

    {/* Back button */}
<div className="absolute top-24 left-0 right-0 section-padding z-10">
  <Link
    href="/destinations"
    className="inline-flex items-center gap-2 text-sm text-white bg-black/15 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full hover:bg-white/25 transition-all duration-300"
  >
    <FiArrowLeft className="w-4 h-4" />
    All Destinations
  </Link>
</div>

        {/* Hero content */}
        <div className="absolute bottom-0 inset-x-0 section-padding pb-10 z-10">
          <span className="inline-block bg-white/15 backdrop-blur-md border border-white/20 text-sm text-white font-medium uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            {dest.category}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
            {dest.name}
          </h1>
        </div>

        {/* Bottom fade to page bg */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#faf9f7] to-transparent" />
      </section>

      {/* ───── Content ───── */}
      <div className="section-padding py-10 lg:py-14">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
                About {dest.name}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                {dest.description}
              </p>
            </div>

            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="mt-8 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <h2 className="font-display text-xl font-bold text-gray-900 mb-5">
                  Highlights
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-accent-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FiCheck className="w-3 h-3 text-accent-500" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Packages */}
            {relatedPackages.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-xl font-bold text-gray-900 mb-5">
                  Tours That Visit {dest.name}
                </h2>
                <div className="space-y-3">
                  {relatedPackages.map((pkg: any) => (
                    <Link
                      key={pkg.id}
                      href={`/packages/${pkg.slug}`}
                      className="group block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-primary-900/20 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display font-bold text-gray-900 group-hover:text-primary-900 transition-colors">
                            {pkg.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {pkg.duration} &bull;{" "}
                            {pkg.price
                              ? `From US$ ${pkg.price}`
                              : "Contact for price"}
                          </p>
                        </div>
                        <span className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary-900 group-hover:text-white transition-all duration-300 flex-shrink-0">
                          <FiArrowUpRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ───── Sidebar ───── */}
          <div>
            <div className="sticky top-24 space-y-4">
              {/* WhatsApp CTA card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-display text-lg font-bold text-gray-900 mb-2">
                  Want to visit {dest.name}?
                </h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  We&apos;ll build a custom tour that includes {dest.name} along
                  with your other dream destinations. Free quote, no obligation.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-6 py-3.5 rounded-full font-bold text-base hover:bg-[#1fb855] transition-all duration-300 shadow-lg shadow-[#25D366]/20 hover:-translate-y-0.5"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Ask About {dest.name}
                </a>
                <Link
                  href="/plan"
                  className="w-full inline-flex items-center justify-center gap-2 border-2 border-primary-900 text-primary-900 px-6 py-3 rounded-full font-semibold text-sm hover:bg-primary-900 hover:text-white transition-all duration-300 mt-3"
                >
                  Pick Multiple Destinations
                </Link>
              </div>

              {/* Quick info card */}
              <div className="bg-primary-950 rounded-2xl p-6 text-center">
                <p className="text-accent-400 font-display font-bold text-lg mb-1">
                  24/7 Support
                </p>
                <p className="text-white/50 text-sm">
                  Reach us anytime on WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
