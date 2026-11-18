"use client";

import Link from "next/link";
import Image from "next/image";
import { FiClock, FiArrowUpRight, FiMapPin } from "react-icons/fi";
import { formatPrice, parseJSON } from "@/lib/helpers";
import { motion } from "framer-motion";

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
  index?: number;
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
  index = 0,
}: PackageCardProps) {
  const destList = parseJSON<string[]>(destinations, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
    >
      <Link
        href={`/packages/${slug}`}
        className="group block relative rounded-3xl overflow-hidden cursor-pointer min-h-[300px] sm:min-h-[340px]"
      >
        {/* Background image */}
        <div className="absolute inset-0 bg-primary-950">
          <Image
            src={image || "/images/packages/default.jpg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
          />
        </div>

        {/* Dark gradient overlay — matches story cards */}
        <div className="package-card-overlay" />

        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
          {/* Duration pill */}
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2 rounded-full border border-white/20">
            <FiClock className="w-3.5 h-3.5" />
            {durationDays} Days
          </span>

          {/* Arrow */}
          <span className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 group-hover:bg-accent-500 group-hover:border-accent-500 group-hover:text-white transition-all duration-300">
            <FiArrowUpRight className="w-4 h-4" />
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 inset-x-0 p-5 z-10">
          {/* Price */}
          <div className="mb-3">
            <span className="inline-flex items-center gap-1 text-accent-400 text-sm font-semibold tracking-wide drop-shadow-lg">
              {formatPrice(price, priceLabel)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug mb-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
            {title}
          </h3>

          {/* Destinations */}
          {destList.length > 0 && (
            <p className="flex items-center gap-1.5 text-sm text-white/70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
              <FiMapPin className="w-3.5 h-3.5 flex-shrink-0 text-white/50" />
              {destList.slice(0, 3).join(" · ")}
              {destList.length > 3 && ` +${destList.length - 3}`}
            </p>
          )}

          {/* Explore link */}
          <span className="inline-flex items-center gap-2 text-accent-400 text-sm font-semibold mt-3 group-hover:gap-3 transition-all duration-300">
            Explore package
            <FiArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
