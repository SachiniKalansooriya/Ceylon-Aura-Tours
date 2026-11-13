"use client";

import Link from "next/link";
import Image from "next/image";
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
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
    >
      <Link href={`/destinations/${slug}`} className="group block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="relative h-56 bg-gray-200/50 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl bg-gradient-to-br from-primary-100/50 to-coral-100/50">
              📍
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <motion.span
              className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-xs font-medium text-white uppercase tracking-wider px-3 py-1 rounded-full mb-2"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
            >
              {category}
            </motion.span>
            <h3 className="font-display text-xl font-bold text-white group-hover:translate-x-1 transition-transform duration-300">
              {name}
            </h3>
            {shortDesc && (
              <p className="text-sm text-gray-200 mt-1 line-clamp-1">{shortDesc}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
