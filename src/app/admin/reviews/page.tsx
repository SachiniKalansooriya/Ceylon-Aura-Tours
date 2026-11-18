"use client";

import { useEffect, useState } from "react";
import { FiTrash2, FiX, FiAlertTriangle, FiStar } from "react-icons/fi";
import FeaturedToggle from "@/components/FeaturedToggle";

interface Review {
  id: string;
  name: string;
  country: string;
  comment: string;
  rating: number;
  published: boolean;
  createdAt: string;
}

type Filter = "all" | "shown" | "hidden";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <FiStar
          key={s}
          className={`w-3.5 h-3.5 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
        />
      ))}
    </span>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/reviews?all=1");
    if (res.ok) setReviews(await res.json());
    else setError("Could not load reviews.");
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggle(review: Review) {
    setTogglingId(review.id);
    setError("");
    const next = !review.published;
    // Update straight away so the switch feels instant; undo if the save fails.
    setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, published: next } : r)));
    const res = await fetch(`/api/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: next }),
    });
    if (!res.ok) {
      setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, published: review.published } : r)));
      setError("Could not update the review. Please try again.");
    }
    setTogglingId(null);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    const res = await fetch(`/api/reviews/${deleteTarget.id}`, { method: "DELETE" });
    if (res.ok) setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    else setError("Could not delete the review.");
    setDeleteTarget(null);
    setDeleting(false);
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900" /></div>;
  }

  const shownCount = reviews.filter((r) => r.published).length;
  const visible = reviews.filter((r) =>
    filter === "all" ? true : filter === "shown" ? r.published : !r.published
  );
  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: reviews.length },
    { key: "shown", label: "Shown", count: shownCount },
    { key: "hidden", label: "Hidden", count: reviews.length - shownCount },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">
            New reviews appear on the website straight away. Switch one off to hide it.
          </p>
        </div>
        <div className="flex gap-1 bg-white/60 rounded-xl p-1 w-fit" role="tablist" aria-label="Filter reviews">
          {filters.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f.key ? "bg-primary-900 text-white" : "text-gray-600 hover:bg-white"
              }`}
            >
              {f.label} <span className="opacity-70">({f.count})</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50/60 p-3 rounded-xl border border-red-200/50 mb-4">{error}</p>
      )}

      {visible.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <p className="text-gray-400">
            {reviews.length === 0 ? "No reviews yet." : `No ${filter} reviews.`}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((r) => (
            <li
              key={r.id}
              className={`glass-card p-4 sm:p-5 transition-opacity ${r.published ? "" : "opacity-60"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                    <span className="text-xs text-gray-500">{r.country}</span>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(r.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteTarget(r)}
                  className="p-2 -m-1 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 shrink-0"
                  aria-label={`Delete review by ${r.name}`}
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-gray-700 mt-3 whitespace-pre-line break-words">{r.comment}</p>

              <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100">
                <span className={`text-xs font-medium ${r.published ? "text-green-700" : "text-gray-500"}`}>
                  {r.published ? "Shown on website" : "Hidden from website"}
                </span>
                <FeaturedToggle
                  checked={r.published}
                  loading={togglingId === r.id}
                  label="Show on website"
                  title={r.published ? "Hide from website" : "Show on website"}
                  onChange={() => toggle(r)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !deleting && setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <button
              onClick={() => !deleting && setDeleteTarget(null)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              aria-label="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <FiAlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Review</h3>
            <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
              Permanently delete the review by <span className="font-semibold text-gray-900">{deleteTarget.name}</span>?
              To keep it but stop showing it, switch it off instead.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
