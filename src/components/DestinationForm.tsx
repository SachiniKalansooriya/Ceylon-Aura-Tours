"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";

interface DestinationFormProps {
  initialData?: {
    id?: string;
    name: string;
    slug: string;
    description: string;
    shortDesc: string | null;
    image: string | null;
    category: string;
    highlights: string | null;
    seoTitle: string | null;
    seoDesc: string | null;
    featured: boolean;
    published: boolean;
  };
}

const CATEGORIES = [
  "Culture & Heritage",
  "Wildlife & Safari",
  "Beaches & Ocean",
  "Hills & Tea Country",
  "Forts & Towns",
  "Temples & Ritual",
];

export default function DestinationForm({ initialData }: DestinationFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;

  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    shortDesc: initialData?.shortDesc || "",
    image: initialData?.image || "",
    category: initialData?.category || CATEGORIES[0],
    seoTitle: initialData?.seoTitle || "",
    seoDesc: initialData?.seoDesc || "",
    featured: initialData?.featured || false,
    published: initialData?.published ?? true,
  });

  const [highlightsText, setHighlightsText] = useState(() => {
    try {
      return initialData?.highlights
        ? JSON.parse(initialData.highlights).join(", ")
        : "";
    } catch {
      return "";
    }
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

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

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.path) imagePath = uploadData.path;
      }

      const body = {
        ...form,
        slug: form.slug || slugify(form.name, { lower: true, strict: true }),
        image: imagePath,
        highlights: textToJsonArray(highlightsText),
      };

      const url = isEditing
        ? `/api/destinations/${initialData!.id}`
        : "/api/destinations";
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

      router.push("/admin/destinations");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => {
            const name = e.target.value;
            setForm({
              ...form,
              name,
              slug: isEditing ? form.slug : slugify(name, { lower: true, strict: true }),
            });
          }}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
          placeholder="e.g. Sigiriya"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">/destinations/</span>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description (for cards)</label>
        <input
          type="text"
          value={form.shortDesc}
          onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
          placeholder="One-liner, e.g. Ancient rock fortress with stunning views"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
        {form.image && <p className="text-sm text-gray-500 mb-2">Current: {form.image}</p>}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={6}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Highlights (comma-separated)</label>
        <input
          type="text"
          value={highlightsText}
          onChange={(e) => setHighlightsText(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
          placeholder="UNESCO World Heritage Site, Ancient frescoes, Lion's Paw Terrace"
        />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-4">SEO Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
            <input
              type="text"
              value={form.seoTitle}
              onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
            <textarea
              value={form.seoDesc}
              onChange={(e) => setForm({ ...form, seoDesc: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded" />
          <span className="text-sm text-gray-700">Featured on homepage</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 rounded" />
          <span className="text-sm text-gray-700">Published</span>
        </label>
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? "Saving..." : isEditing ? "Update Destination" : "Create Destination"}
        </button>
        <button type="button" onClick={() => router.push("/admin/destinations")} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
          Cancel
        </button>
      </div>
    </form>
  );
}
