"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FeaturedToggle from "@/components/FeaturedToggle";
import { MAX_FEATURED } from "@/lib/featured-limit";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff, FiAlertTriangle, FiX } from "react-icons/fi";

interface Destination {
  id: string;
  name: string;
  slug: string;
  category: string;
  featured: boolean;
  published: boolean;
}

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Destination | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [publishTarget, setPublishTarget] = useState<Destination | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [featuringId, setFeaturingId] = useState<string | null>(null);
  const [featureError, setFeatureError] = useState("");

  async function load() {
    const res = await fetch("/api/destinations");
    setDestinations(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/destinations/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    setDeleting(false);
    load();
  }

  async function confirmPublish() {
    if (!publishTarget) return;
    setPublishing(true);
    await fetch(`/api/destinations/${publishTarget.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !publishTarget.published }),
    });
    setPublishTarget(null);
    setPublishing(false);
    load();
  }

  const featuredCount = destinations.filter((x) => x.featured).length;
  const limitReached = featuredCount >= MAX_FEATURED;

  async function toggleFeatured(target: Destination) {
    setFeaturingId(target.id);
    setFeatureError("");
    const res = await fetch(`/api/destinations/${target.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !target.featured }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setFeatureError(data.error || "Failed to update homepage visibility");
    }
    await load();
    setFeaturingId(null);
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900" /></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Destinations</h1>
        <Link href="/admin/destinations/new" className="btn-primary text-sm w-fit">
          <FiPlus className="w-4 h-4" />
          Add Destination
        </Link>
      </div>

      <p className="text-sm text-gray-500 -mt-3 sm:-mt-5 mb-4">
        Featured on homepage:{" "}
        <span className={`font-semibold ${limitReached ? "text-accent-700" : "text-gray-900"}`}>
          {featuredCount} / {MAX_FEATURED}
        </span>
      </p>

      {featureError && (
        <p className="text-red-500 text-sm bg-red-50/60 backdrop-blur-sm p-3 rounded-xl border border-red-200/50 mb-4">{featureError}</p>
      )}

      {destinations.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <p className="text-gray-400 mb-4">No destinations yet</p>
          <Link href="/admin/destinations/new" className="btn-primary text-sm"><FiPlus className="w-4 h-4" /> Add First Destination</Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="glass-card overflow-hidden hidden md:block">
            <table className="w-full text-sm">
              <thead className="bg-white/40 border-b border-white/30">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Featured on Homepage</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {destinations.map((d) => (
                  <tr key={d.id} className="hover:bg-white/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {d.name}
                    </td>
                    <td className="py-3 px-4 text-gray-500">{d.category}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${d.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {d.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FeaturedToggle
                          checked={d.featured}
                          loading={featuringId === d.id}
                          disabled={!d.featured && limitReached}
                          title={!d.featured && limitReached ? `Limit of ${MAX_FEATURED} reached` : undefined}
                          onChange={() => toggleFeatured(d)}
                        />
                        <span className="text-xs text-gray-500">{d.featured ? "Yes" : "No"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setPublishTarget(d)} className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                          {d.published ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                        <Link href={`/admin/destinations/${d.id}`} className="p-2 text-gray-400 hover:text-primary-900 rounded-lg hover:bg-gray-100"><FiEdit className="w-4 h-4" /></Link>
                        <button onClick={() => setDeleteTarget(d)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="md:hidden space-y-3">
            {destinations.map((d) => (
              <div key={d.id} className="glass-card p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{d.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{d.category}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${d.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {d.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 py-2 border-t border-gray-100">
                  <span className="text-xs text-gray-600">Featured on homepage</span>
                  <FeaturedToggle
                    checked={d.featured}
                    loading={featuringId === d.id}
                    disabled={!d.featured && limitReached}
                    title={!d.featured && limitReached ? `Limit of ${MAX_FEATURED} reached` : undefined}
                    onChange={() => toggleFeatured(d)}
                  />
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button onClick={() => setPublishTarget(d)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    {d.published ? <><FiEyeOff className="w-3.5 h-3.5" /> Unpublish</> : <><FiEye className="w-3.5 h-3.5" /> Publish</>}
                  </button>
                  <Link href={`/admin/destinations/${d.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-primary-900 hover:bg-primary-50 rounded-lg transition-colors">
                    <FiEdit className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button onClick={() => setDeleteTarget(d)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <FiTrash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ───── Delete Confirmation Modal ───── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => !deleting && setDeleteTarget(null)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <FiAlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Destination</h3>
            <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">{deleteTarget.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ───── Publish/Unpublish Confirmation Modal ───── */}
      {publishTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !publishing && setPublishTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => !publishing && setPublishTarget(null)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${publishTarget.published ? "bg-amber-50" : "bg-green-50"}`}>
              {publishTarget.published ? <FiEyeOff className="w-7 h-7 text-amber-500" /> : <FiEye className="w-7 h-7 text-green-500" />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              {publishTarget.published ? "Unpublish" : "Publish"} Destination
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
              Are you sure you want to {publishTarget.published ? "unpublish" : "publish"}{" "}
              <span className="font-semibold text-gray-900">{publishTarget.name}</span>?
              {publishTarget.published
                ? " It will no longer be visible on the website."
                : " It will be visible to all visitors on the website."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPublishTarget(null)}
                disabled={publishing}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmPublish}
                disabled={publishing}
                className={`flex-1 px-4 py-2.5 rounded-xl text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                  publishTarget.published ? "bg-amber-500 hover:bg-amber-600" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {publishing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {publishTarget.published ? "Unpublishing..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    {publishTarget.published ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    {publishTarget.published ? "Unpublish" : "Publish"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}