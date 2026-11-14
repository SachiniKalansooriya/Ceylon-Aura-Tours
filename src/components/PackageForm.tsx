"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";

interface PackageFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    description: string;
    highlights: string;
    duration: string;
    durationDays: number;
    price: number | null;
    priceLabel: string | null;
    image: string | null;
    images: string | null;
    destinations: string;
    itinerary: string | null;
    inclusions: string | null;
    exclusions: string | null;
    seoTitle: string | null;
    seoDesc: string | null;
    featured: boolean;
    published: boolean;
  };
}

export default function PackageForm({ initialData }: PackageFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;

  const [form, setForm] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    highlights: initialData?.highlights || "[]",
    duration: initialData?.duration || "",
    durationDays: initialData?.durationDays || 1,
    price: initialData?.price ?? "",
    priceLabel: initialData?.priceLabel || "per person",
    image: initialData?.image || "",
    images: initialData?.images || "[]",
    destinations: initialData?.destinations || "[]",
    itinerary: initialData?.itinerary || "[]",
    inclusions: initialData?.inclusions || "[]",
    exclusions: initialData?.exclusions || "[]",
    seoTitle: initialData?.seoTitle || "",
    seoDesc: initialData?.seoDesc || "",
    featured: initialData?.featured || false,
    published: initialData?.published ?? true,
  });

  // Simple comma-separated editors for JSON arrays
  const [highlightsText, setHighlightsText] = useState(
    safeParseJoin(initialData?.highlights)
  );
  const [destinationsText, setDestinationsText] = useState(
    safeParseJoin(initialData?.destinations)
  );
  const [inclusionsText, setInclusionsText] = useState(
    safeParseJoin(initialData?.inclusions)
  );
  const [exclusionsText, setExclusionsText] = useState(
    safeParseJoin(initialData?.exclusions)
  );
  const [itineraryText, setItineraryText] = useState(
    initialData?.itinerary
      ? safeParseItinerary(initialData.itinerary)
      : ""
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>(() => {
    try {
      return initialData?.images ? JSON.parse(initialData.images) : [];
    } catch {
      return [];
    }
  });

  function safeParseJoin(str?: string | null): string {
    try {
      return str ? JSON.parse(str).join(", ") : "";
    } catch {
      return "";
    }
  }

  function safeParseItinerary(str: string): string {
    try {
      const arr = JSON.parse(str) as { day: string; title: string; description: string }[];
      return arr.map((d) => `Day ${d.day}: ${d.title}\n${d.description}`).join("\n\n");
    } catch {
      return "";
    }
  }

  function parseItineraryText(text: string) {
    if (!text.trim()) return "[]";
    const blocks = text.split(/\n\n+/);
    const result = blocks.map((block) => {
      const lines = block.split("\n");
      const firstLine = lines[0] || "";
      const match = firstLine.match(/^Day\s*(\d+)\s*:\s*(.+)/i);
      return {
        day: match ? match[1] : "1",
        title: match ? match[2] : firstLine,
        description: lines.slice(1).join("\n").trim(),
      };
    });
    return JSON.stringify(result);
  }

  function textToJsonArray(text: string): string {
    if (!text.trim()) return "[]";
    return JSON.stringify(text.split(",").map((s) => s.trim()).filter(Boolean));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let imagePath = form.image;

      // Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.path) imagePath = uploadData.path;
      }

      // Upload gallery images
      const uploadedGalleryPaths: string[] = [...existingGallery];
      for (const file of galleryFiles) {
        const gFormData = new FormData();
        gFormData.append("file", file);
        const gRes = await fetch("/api/upload", { method: "POST", body: gFormData });
        const gData = await gRes.json();
        if (gData.path) uploadedGalleryPaths.push(gData.path);
      }

      const body = {
        ...form,
        slug: form.slug || slugify(form.title, { lower: true, strict: true }),
        price: form.price === "" ? null : Number(form.price),
        image: imagePath,
        images: JSON.stringify(uploadedGalleryPaths),
        highlights: textToJsonArray(highlightsText),
        destinations: textToJsonArray(destinationsText),
        inclusions: textToJsonArray(inclusionsText),
        exclusions: textToJsonArray(exclusionsText),
        itinerary: parseItineraryText(itineraryText),
      };

      const url = isEditing
        ? `/api/packages/${initialData!.id}`
        : "/api/packages";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      router.push("/admin/packages");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Package Title *
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => {
            setForm({ ...form, title: e.target.value });
            if (!isEditing) {
              setForm((f) => ({
                ...f,
                title: e.target.value,
                slug: slugify(e.target.value, { lower: true, strict: true }),
              }));
            }
          }}
          className="glass-input w-full"
          placeholder="e.g. 5-Day Cultural Triangle Tour"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL Slug
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">/packages/</span>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="glass-input flex-1"
          />
        </div>
      </div>

      {/* Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration Label *
          </label>
          <input
            type="text"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="glass-input w-full"
            placeholder="e.g. 5 Days / 4 Nights"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Days (number) *
          </label>
          <input
            type="number"
            min={1}
            value={form.durationDays}
            onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
            className="glass-input w-full"
            required
          />
        </div>
      </div>

      {/* Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (USD) — leave blank for &quot;Contact for price&quot;
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="glass-input w-full"
            placeholder="e.g. 350"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Label
          </label>
          <input
            type="text"
            value={form.priceLabel}
            onChange={(e) => setForm({ ...form, priceLabel: e.target.value })}
            className="glass-input w-full"
            placeholder="e.g. per person"
          />
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Main Image
        </label>
        {form.image && (
          <p className="text-sm text-gray-500 mb-2">Current: {form.image}</p>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="glass-input w-full text-sm"
        />
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gallery Images (shown in the image slider)
        </label>
        {existingGallery.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {existingGallery.map((img, i) => (
              <div key={i} className="relative group">
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => setExistingGallery((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {galleryFiles.length > 0 && (
          <p className="text-xs text-primary-600 mb-2">
            + {galleryFiles.length} new image{galleryFiles.length > 1 ? "s" : ""} to upload
          </p>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setGalleryFiles((prev) => [...prev, ...files]);
          }}
          className="glass-input w-full text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">
          Select multiple images. These appear in the gallery slider on the package detail page.
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={5}
          className="glass-input w-full"
          required
        />
      </div>

      {/* Destinations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Destinations (comma-separated)
        </label>
        <input
          type="text"
          value={destinationsText}
          onChange={(e) => setDestinationsText(e.target.value)}
          className="glass-input w-full"
          placeholder="Sigiriya, Kandy, Ella, Galle"
        />
      </div>

      {/* Highlights */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Highlights (comma-separated)
        </label>
        <input
          type="text"
          value={highlightsText}
          onChange={(e) => setHighlightsText(e.target.value)}
          className="glass-input w-full"
          placeholder="Climb Sigiriya Rock, Visit Temple of the Tooth, Scenic train ride"
        />
      </div>

      {/* Itinerary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Itinerary (one block per day, separated by blank lines)
        </label>
        <textarea
          value={itineraryText}
          onChange={(e) => setItineraryText(e.target.value)}
          rows={10}
          className="glass-input w-full font-mono text-sm"
          placeholder={`Day 1: Arrival & Colombo\nAirport pickup, city tour, hotel check-in.\n\nDay 2: Sigiriya & Dambulla\nClimb Sigiriya Rock Fortress, visit Dambulla Cave Temple.`}
        />
      </div>

      {/* Inclusions / Exclusions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Included (comma-separated)
          </label>
          <textarea
            value={inclusionsText}
            onChange={(e) => setInclusionsText(e.target.value)}
            rows={3}
            className="glass-input w-full text-sm"
            placeholder="Private vehicle, Driver, Hotel accommodation"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Not Included (comma-separated)
          </label>
          <textarea
            value={exclusionsText}
            onChange={(e) => setExclusionsText(e.target.value)}
            rows={3}
            className="glass-input w-full text-sm"
            placeholder="Flights, Entrance tickets, Meals"
          />
        </div>
      </div>

      {/* SEO */}
      <div className="border-t border-white/30 pt-6">
        <h3 className="font-semibold text-gray-900 mb-4">SEO Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO Title (for Google)
            </label>
            <input
              type="text"
              value={form.seoTitle}
              onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
              className="glass-input w-full"
              placeholder="Leave blank to use package title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO Description (for Google)
            </label>
            <textarea
              value={form.seoDesc}
              onChange={(e) => setForm({ ...form, seoDesc: e.target.value })}
              rows={2}
              className="glass-input w-full"
              placeholder="Leave blank to use first 160 chars of description"
            />
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Featured on homepage</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Published</span>
        </label>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50/60 backdrop-blur-sm p-3 rounded-xl border border-red-200/50">{error}</p>
      )}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving..." : isEditing ? "Update Package" : "Create Package"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/packages")}
          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
