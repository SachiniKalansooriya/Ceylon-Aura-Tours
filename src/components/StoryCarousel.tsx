"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { categorySlug } from "@/lib/category-slug";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export interface StoryCategory {
  id: string;
  name: string;
  slug?: string | null;
  description: string | null;
  image: string | null;
}

export default function StoryCarousel({ categories }: { categories: StoryCategory[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories.length]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>(".story-slide")?.offsetWidth ?? 320;
    const gap = 20;
    const distance = cardWidth + gap;
    el.scrollBy({ left: direction === "left" ? -distance : distance, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className={`hidden sm:flex absolute sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center transition-all duration-300 hover:bg-primary-900 hover:text-white hover:border-primary-900 ${
          canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll left"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className={`hidden sm:flex absolute sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-200 items-center justify-center transition-all duration-300 hover:bg-primary-900 hover:text-white hover:border-primary-900 ${
          canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll right"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-2"
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/destinations#${categorySlug(cat)}`}
            className="story-slide story-card block group flex-shrink-0 snap-start w-[85%] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-13.34px)] xl:w-[calc(25%-15px)] !min-h-[360px] sm:!min-h-[420px]"
          >
            {/* Background image */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-950">
              {cat.image && (
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
            </div>
            <div className="story-card-overlay" />
            <div className="story-card-content">
              <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug mb-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                {cat.name}
              </h3>
              {cat.description && (
                <p className="text-sm text-white/80 leading-relaxed mb-4 line-clamp-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                  {cat.description}
                </p>
              )}
              <span className="inline-flex items-center gap-2 text-accent-400 text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                Discover the story
                <FiArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
