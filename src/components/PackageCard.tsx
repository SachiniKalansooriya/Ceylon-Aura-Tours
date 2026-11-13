import Link from "next/link";
import Image from "next/image";
import { FiClock, FiArrowRight } from "react-icons/fi";
import { formatPrice, parseJSON } from "@/lib/helpers";

interface PackageCardProps {
  slug: string;
  title: string;
  image: string | null;
  duration: string;
  durationDays: number;
  price: number | null;
  priceLabel: string | null;
  destinations: string;
  shortDesc?: string;
}

export default function PackageCard({
  slug,
  title,
  image,
  duration,
  durationDays,
  price,
  priceLabel,
  destinations,
}: PackageCardProps) {
  const destList = parseJSON<string[]>(destinations, []);

  return (
    <Link href={`/packages/${slug}`} className="card group block">
      {/* Image */}
      <div className="relative h-52 bg-gray-200 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
            🏝️
          </div>
        )}
        <div className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          {durationDays} DAYS
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>

        {destList.length > 0 && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-1">
            {destList.join(" · ")}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="flex items-center gap-1 text-xs text-gray-400 mb-1">
              <FiClock className="w-3 h-3" />
              {duration}
            </span>
            <span className="text-primary-700 font-bold">
              {formatPrice(price, priceLabel)}
            </span>
          </div>
          <span className="text-primary-600 group-hover:translate-x-1 transition-transform">
            <FiArrowRight className="w-5 h-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
