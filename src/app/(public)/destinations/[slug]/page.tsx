import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
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
  return destinations.map((d) => ({ slug: d.slug }));
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
    <div className="section-padding py-8 lg:py-12">
      <Link
        href="/destinations"
        className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 mb-6"
      >
        <FiArrowLeft className="w-4 h-4" />
        All Destinations
      </Link>

      {/* Hero Image */}
      {dest.image && (
        <div className="relative h-64 sm:h-80 lg:h-[28rem] rounded-xl overflow-hidden mb-8">
          <Image
            src={dest.image}
            alt={dest.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <span className="text-sm text-primary-300 font-medium uppercase tracking-wider">
              {dest.category}
            </span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mt-1">
              {dest.name}
            </h1>
          </div>
        </div>
      )}

      {!dest.image && (
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-6">
          {dest.name}
        </h1>
      )}

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
              {dest.description}
            </p>
          </div>

          {highlights.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
                Highlights
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

          {/* Related Packages */}
          {relatedPackages.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-xl font-bold text-gray-900 mb-4">
                Tours That Visit {dest.name}
              </h2>
              <div className="space-y-3">
                {relatedPackages.map((pkg) => (
                  <Link
                    key={pkg.id}
                    href={`/packages/${pkg.slug}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition"
                  >
                    <h3 className="font-semibold text-gray-900">
                      {pkg.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {pkg.duration} &bull;{" "}
                      {pkg.price
                        ? `From US$ ${pkg.price}`
                        : "Contact for price"}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-display text-lg font-bold text-gray-900 mb-2">
              Want to visit {dest.name}?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              We&apos;ll build a custom tour that includes {dest.name} along
              with your other dream destinations.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn-whatsapp justify-center"
            >
              <FaWhatsapp className="w-5 h-5" />
              Plan This Trip
            </a>
            <Link
              href="/plan"
              className="w-full btn-outline justify-center mt-3 text-sm"
            >
              Pick Multiple Destinations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
