"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiEdit, FiTrash2, FiX, FiAlertTriangle, FiImage } from "react-icons/fi";
import { categorySlug, toSlug } from "@/lib/category-slug";

interface Category {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  image: string | null;
}

const emptyForm = { name: "", slug: "", description: "", image: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [editId, setEditId] = useState<string | null>(null);
  // Keep the slug following the name until the admin types their own
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const [catRes, destRes] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/destinations"),
    ]);
    setCategories(await catRes.json());
    const dests: { category: string }[] = await destRes.json();
    const c: Record<string, number> = {};
    for (const d of dests) c[d.category] = (c[d.category] || 0) + 1;
    setCounts(c);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const [filePreview, setFilePreview] = useState("");
  useEffect(() => {
    if (!imageFile) { setFilePreview(""); return; }
    const url = URL.createObjectURL(imageFile);
    setFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  function resetForm() {
    setForm(emptyForm);
    setImageFile(null);
    setFileInputKey((k) => k + 1);
    setEditId(null);
    setSlugEdited(false);
  }

  function startEdit(c: Category) {
    setEditId(c.id);
    setForm({ name: c.name, slug: categorySlug(c), description: c.description || "", image: c.image || "" });
    setSlugEdited(true);
    setImageFile(null);
    setFileInputKey((k) => k + 1);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setError("");

    try {
      let imagePath = form.image;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.path) throw new Error(uploadData.error || "Image upload failed");
        imagePath = uploadData.path;
      }

      const res = await fetch(editId ? `/api/categories/${editId}` : "/api/categories", {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug: toSlug(form.slug) || toSlug(form.name), image: imagePath }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save category");
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    const res = await fetch(`/api/categories/${deleteTarget.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to delete category");
    } else if (editId === deleteTarget.id) {
      resetForm();
    }
    setDeleteTarget(null);
    setDeleting(false);
    load();
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900" /></div>;
  }

  const previewSrc = filePreview || form.image;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Categories</h1>
      </div>

      {/* Add / Edit form */}
      <form onSubmit={handleSubmit} className="glass-card p-4 sm:p-6 mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">{editId ? "Edit Category" : "Add Category"}</h2>
          {editId && (
            <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <FiX className="w-4 h-4" /> Cancel edit
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm({ ...form, name, slug: slugEdited ? form.slug : toSlug(name) });
            }}
            className="glass-input w-full"
            placeholder="e.g. Wildlife & Safari"
            maxLength={100}
            required
          />
        </div>

        <div>
          <label htmlFor="cat-slug" className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <div className="flex items-center rounded-xl overflow-hidden">
            <span className="text-sm text-gray-400 shrink-0 pr-2 hidden sm:inline">/destinations#</span>
            <input
              id="cat-slug"
              type="text"
              value={form.slug}
              onChange={(e) => {
                setSlugEdited(true);
                setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") });
              }}
              onBlur={() => setForm((f) => ({ ...f, slug: toSlug(f.slug) || toSlug(f.name) }))}
              className="glass-input w-full min-w-0"
              placeholder="e.g. wildlife-and-safari"
              maxLength={100}
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Used in links to this category. Lowercase letters, numbers and dashes only; filled in from the name automatically.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="glass-input w-full"
            placeholder="Shown on the homepage story cards"
            maxLength={500}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {previewSrc ? (
              <img src={previewSrc} alt="" className="w-full sm:w-32 h-40 sm:h-20 object-cover rounded-xl border border-white/40" />
            ) : (
              <div className="w-full sm:w-32 h-40 sm:h-20 rounded-xl bg-white/40 border border-white/40 flex items-center justify-center text-gray-400">
                <FiImage className="w-6 h-6" />
              </div>
            )}
            <input
              key={fileInputKey}
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="glass-input w-full text-sm"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50/60 backdrop-blur-sm p-3 rounded-xl border border-red-200/50">{error}</p>}

        <button type="submit" disabled={saving || !form.name.trim()} className="btn-primary text-sm w-fit disabled:opacity-50">
          {editId ? <FiEdit className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
          {saving ? "Saving..." : editId ? "Update Category" : "Add Category"}
        </button>
      </form>

      {categories.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <p className="text-gray-400">No categories yet. Add one above.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <ul className="divide-y divide-white/20">
            {categories.map((c) => (
              <li key={c.id} className={`flex items-center gap-3 sm:gap-4 py-3 px-3 sm:px-4 transition-colors ${editId === c.id ? "bg-white/40" : "hover:bg-white/30"}`}>
                {c.image ? (
                  <img src={c.image} alt="" className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/40 flex items-center justify-center text-gray-400 shrink-0">
                    <FiImage className="w-5 h-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{c.name}</p>
                  <p className="text-xs text-gray-400 font-mono truncate">/{categorySlug(c)}</p>
                  {c.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{c.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    {counts[c.name] || 0} destination{(counts[c.name] || 0) === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => startEdit(c)} className="p-2 text-gray-400 hover:text-primary-900 rounded-lg hover:bg-gray-100" aria-label="Edit">
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(c)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100" aria-label="Delete">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
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
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Category</h3>
            <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">{deleteTarget.name}</span>?
              {(counts[deleteTarget.name] || 0) > 0 &&
                ` It is used by ${counts[deleteTarget.name]} destination(s), so it can't be deleted until they are moved to another category.`}
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
    </div>
  );
}
