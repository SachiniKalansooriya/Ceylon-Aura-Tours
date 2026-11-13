"use client";

import Link from "next/link";
import Image from "next/image";
import { FiClock, FiArrowRight } from "react-icons/fi";
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
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
    >
      <Link href={`/packages/${slug}`} className="glass-card group block overflow-hidden">
        {/* Image */}
        <div className="relative h-52 bg-gray-200/50 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl bg-gradient-to-br from-primary-100/50 to-accent-100/50">
              🏝️
            </div>
          )}
          <motion.div
            className="absolute top-3 left-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-primary-500/30"
            initial={{ scale: 0, rotate: -10 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200, damping: 15 }}
          >
            {durationDays} DAYS
          </motion.div>
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
            <span className="bg-primary-100/60 p-2 rounded-full text-primary-600 group-hover:bg-primary-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
              <FiArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
