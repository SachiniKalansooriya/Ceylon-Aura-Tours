"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const stories = [
  {
    title: "Ancient Kingdoms & Sacred Sites",
    desc: "Explore UNESCO World Heritage sites from Sigiriya to Anuradhapura.",
    image: "/images/stories/ancient.jpg",
    link: "/destinations",
  },
  {
    title: "Wildlife & Nature Safaris",
    desc: "Encounter leopards, elephants and exotic birds in their natural habitat.",
    image: "/images/stories/wildlife.jpg",
    link: "/packages",
  },
  {
    title: "The Kandy Esala Perahera",
    desc: "Experience the colour, music, and traditions of Kandy's iconic celebration.",
    image: "/images/stories/perahera.jpg",
    link: "/destinations",
  },
  {
    title: "Beach & Coastal Escapes",
    desc: "Discover pristine beaches from Mirissa to Trincomalee.",
    image: "/images/stories/beach.jpg",
    link: "/packages",
  },
  {
    title: "Tea Country & Hill Trails",
    desc: "Wander through misty plantations and scenic train rides in Ella and Nuwara Eliya.",
    image: "/images/stories/tea-country.jpg",
    link: "/destinations",
  },
  {
    title: "Culinary Journeys",
    desc: "Taste authentic Sri Lankan flavors from street food to fine dining experiences.",
    image: "/images/stories/culinary.jpg",
    link: "/packages",
  },
];

export default function StoryCarousel() {
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
  }, []);

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
        className={`absolute left-0 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 hover:bg-primary-900 hover:text-white hover:border-primary-900 ${
          canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll left"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className={`absolute right-0 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-300 hover:bg-primary-900 hover:text-white hover:border-primary-900 ${
          canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll right"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
      >
        {stories.map((story) => (
          <Link
            key={story.title}
            href={story.link}
            className="story-slide story-card block group flex-shrink-0"
            style={{ width: "calc(25% - 15px)", minWidth: "280px" }}
          >
            {/* Background image */}
            <div className="absolute inset-0 bg-primary-950">
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="story-card-overlay" />
            <div className="story-card-content">
              <h3 className="font-display text-xl font-bold text-white leading-snug mb-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                {story.title}
              </h3>
              <p className="text-sm text-white/80 leading-relaxed mb-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                {story.desc}
              </p>
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
