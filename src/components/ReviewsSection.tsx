"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight, FiX, FiStar, FiSend } from "react-icons/fi";

interface Review {
  id: string | number;
  name: string;
  country: string;
  comment: string;
  rating: number;
}

function StarRating({
  rating,
  onRate,
  interactive = false,
}: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
          disabled={!interactive}
        >
          <FiStar
            className={`w-4 h-4 transition-colors ${
              star <= (hover || rating)
                ? "fill-accent-400 text-accent-400"
                : "text-white/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const [current, setCurrent] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    comment: "",
    rating: 5,
  });
  const [submitted, setSubmitted] = useState(false);
  const [fade, setFade] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [isLong, setIsLong] = useState(false);
  const commentRef = useRef<HTMLParagraphElement>(null);

  // Show "See more" only when the clamped text is actually cut off
  useLayoutEffect(() => {
    const el = commentRef.current;
    if (!el || expanded) return;
    const check = () => setIsLong(el.scrollHeight > el.clientHeight + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [current, reviews, expanded]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data: Review[]) => {
        if (Array.isArray(data)) setReviews(data);
      })
      .catch(() => {});
  }, []);

  const goTo = (index: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(index);
      setExpanded(false);
      setFade(true);
    }, 200);
  };

  const prev = () => goTo(current === 0 ? reviews.length - 1 : current - 1);
  const next = () => goTo(current === reviews.length - 1 ? 0 : current + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.country || !formData.comment) return;

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const newReview: Review = await res.json();
      setReviews((prev) => [newReview, ...prev]);
      setSubmitted(true);

      setTimeout(() => {
        setShowModal(false);
        setSubmitted(false);
        setFormData({ name: "", country: "", comment: "", rating: 5 });
        setCurrent(0);
      }, 2000);
    } catch {
      // ignore; form stays open so the user can retry
    }
  };

  const review = reviews[current] as Review | undefined;

  return (
    <>
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/reviews-bg.jpg')" }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Subtle gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/20 via-transparent to-primary-950/30" />

        <div className="section-padding section-spacing relative z-10">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-accent-400 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              <span className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
              Traveler Stories
              <span className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-800 text-white leading-tight">
              What Our{" "}
              <span className="text-accent-400">Guests</span> Say
            </h2>
            <p className="text-white/50 mt-3 max-w-lg mx-auto">
              Real experiences from travelers who explored Sri Lanka with us.
            </p>
          </div>

          {review ? (
            <>
              {/* Single review with arrows */}
              <div className="relative max-w-5xl mx-auto flex items-center gap-2 sm:gap-6">
                {/* Left arrow */}
                <button
                  onClick={prev}
                  className="flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-accent-500 hover:border-accent-500"
                  aria-label="Previous review"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>

                {/* Review card — horizontal rectangle on desktop, stacked on mobile */}
                <div
                  className={`flex-1 min-w-0 rounded-2xl p-5 sm:p-6 md:px-8 md:py-6 bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-center md:text-left transition-all duration-300 ${
                    fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                >
                  {/* Author */}
                  <div className="flex flex-col items-center md:w-44 md:flex-shrink-0 md:border-r md:border-white/10 md:pr-8">
                    <div className="w-12 h-12 rounded-full bg-accent-500/20 border border-accent-400/30 flex items-center justify-center text-accent-400 font-bold text-lg mb-2">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-white font-bold text-base leading-tight text-center">{review.name}</p>
                    <p className="text-white/40 text-sm mb-1.5 text-center">{review.country}</p>
                    <StarRating rating={review.rating} />
                  </div>

                  {/* Comment */}
                  <div className="flex-1 min-w-0">
                    <div className="text-accent-400/30 text-4xl font-serif leading-none h-5 md:mb-1">
                      &ldquo;
                    </div>
                    <p
                      ref={commentRef}
                      className={`text-white/80 text-base leading-relaxed break-words whitespace-pre-line ${
                        expanded ? "" : "line-clamp-4 md:line-clamp-3"
                      }`}
                    >
                      {review.comment}
                    </p>
                    {isLong && (
                      <button
                        type="button"
                        onClick={() => setExpanded((e) => !e)}
                        className="mt-2 text-accent-400 text-sm font-semibold hover:text-accent-300 transition-colors"
                      >
                        {expanded ? "See less" : "See more"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Right arrow */}
                <button
                  onClick={next}
                  className="flex-shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:bg-accent-500 hover:border-accent-500"
                  aria-label="Next review"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Dot indicators */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`transition-all duration-300 rounded-full ${
                      i === current
                        ? "w-8 h-2.5 bg-accent-400"
                        : "w-2.5 h-2.5 bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-white/50 max-w-md mx-auto">
              No reviews yet — be the first to share your experience!
            </p>
          )}

          {/* Add Review button */}
          <div className="text-center mt-10">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm hover:bg-accent-500 hover:border-accent-500 transition-all duration-300 hover:-translate-y-0.5"
            >
              <FiSend className="w-4 h-4" />
              Share Your Experience
            </button>
          </div>
        </div>
      </section>

      {/* ───── Add Review Modal ───── */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div className="relative w-full max-w-md rounded-2xl bg-primary-950/90 backdrop-blur-2xl border border-white/15 shadow-2xl overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-400/10 rounded-full blur-3xl" />

            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all z-10"
            >
              <FiX className="w-4 h-4" />
            </button>

            <div className="relative p-8">
              {submitted ? (
                /* Success state */
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Thank You!
                  </h3>
                  <p className="text-white/50 text-sm">
                    Your review has been submitted successfully.
                  </p>
                </div>
              ) : (
                /* Form */
                <>
                  <h3 className="text-xl font-display font-700 text-white mb-1">
                    Share Your Experience
                  </h3>
                  <p className="text-white/40 text-sm mb-6">
                    Tell us about your journey through Sri Lanka
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="e.g. Sarah Mitchell"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-accent-400/50 focus:bg-white/10 transition-all"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            country: e.target.value,
                          }))
                        }
                        placeholder="e.g. Australia"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-accent-400/50 focus:bg-white/10 transition-all"
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                        Rating
                      </label>
                      <StarRating
                        rating={formData.rating}
                        onRate={(r) =>
                          setFormData((p) => ({ ...p, rating: r }))
                        }
                        interactive
                      />
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                        Your Experience
                      </label>
                      <textarea
                        value={formData.comment}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            comment: e.target.value,
                          }))
                        }
                        placeholder="Tell us about your trip..."
                        required
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-accent-400/50 focus:bg-white/10 transition-all resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-accent-500 text-white font-bold text-sm hover:bg-accent-600 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <FiSend className="w-4 h-4" />
                      Submit Review
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
