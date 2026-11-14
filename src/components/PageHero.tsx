"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageHeroProps {
  label: string;
  title: string;
  description?: string;
  children?: ReactNode;
  height?: string;
}

export default function PageHero({ label, title, description, children, height = "60vh" }: PageHeroProps) {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: height }}>
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay — gradient from dark top (behind navbar) to slightly lighter middle to dark bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(10, 22, 40, 0.85) 0%,
            rgba(15, 30, 55, 0.70) 40%,
            rgba(10, 22, 40, 0.75) 70%,
            rgba(10, 22, 40, 0.90) 100%
          )`,
        }}
      />

      {/* Content */}
       <div className="relative z-10 section-padding flex items-end" style={{ minHeight: height, paddingBottom: "3rem", paddingTop: "7rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-400 mb-3 block">
            {label}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 leading-[1.1] tracking-tight text-white">
            {title}
          </h1>
          {description && (
            <p className="text-white/60 mt-4 max-w-2xl text-lg leading-relaxed">
              {description}
            </p>
          )}
          {/* Gold accent divider */}
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-accent-500 to-accent-400 mt-6" />
          {children}
        </motion.div>
      </div>

      {/* Bottom fade into page content */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#faf9f7] to-transparent" />
    </section>
  );
}
