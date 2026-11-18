"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { motion } from "framer-motion";

interface DestinationCardProps {
  slug: string;
  name: string;
  image: string | null;
  shortDesc: string | null;
  category: string;
  index?: number;
}

export default function DestinationCard({
  slug,
  name,
  image,
  shortDesc,
  category,
  index = 0,
}: DestinationCardProps) {
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
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
    >
      <Link
        href={`/destinations/${slug}`}
        className="group block relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[4/5] bg-gray-100"
      >
        {/* Full-bleed image */}
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl bg-gradient-to-br from-primary-900/10 to-accent-100/30">
            📍
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Category pill */}
        <div className="absolute top-4 left-4">
          <span className="inline-block bg-white/90 backdrop-blur-md text-gray-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
            {category}
          </span>
        </div>

        {/* Arrow — hover reveal */}
        <div className="absolute top-4 right-4">
          <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <FiArrowUpRight className="w-4 h-4" />
          </span>
        </div>

        {/* Bottom text */}
        <div className="absolute bottom-0 inset-x-0 p-5">
          <h3 className="font-display text-lg font-700 text-white leading-snug mb-1">
            {name}
          </h3>
          {shortDesc && (
            <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
              {shortDesc}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
