"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";

interface Package {
  id: string;
  title: string;
  slug: string;
  durationDays: number;
  price: number | null;
  featured: boolean;
  published: boolean;
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPackages() {
    const res = await fetch("/api/packages");
    const data = await res.json();
    setPackages(data);
    setLoading(false);
  }

  useEffect(() => {
    loadPackages();
  }, []);

  async function deletePackage(id: string) {
    if (!confirm("Are you sure you want to delete this package?")) return;
    await fetch(`/api/packages/${id}`, { method: "DELETE" });
    loadPackages();
  }

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/packages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    loadPackages();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tour Packages</h1>
        <Link href="/admin/packages/new" className="btn-primary text-sm">
          <FiPlus className="w-4 h-4" />
          Add Package
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <p className="text-gray-400 mb-4">No packages yet</p>
          <Link href="/admin/packages/new" className="btn-primary text-sm">
            <FiPlus className="w-4 h-4" />
            Add Your First Package
          </Link>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/40 border-b border-white/30">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Title</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Days</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-white/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{pkg.title}</span>
                    {pkg.featured && (
                      <span className="ml-2 text-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-500">{pkg.durationDays}</td>
                  <td className="py-3 px-4 text-gray-500">
                    {pkg.price ? `US$ ${pkg.price}` : "—"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        pkg.published
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {pkg.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => togglePublish(pkg.id, pkg.published)}
                        className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                        title={pkg.published ? "Unpublish" : "Publish"}
                      >
                        {pkg.published ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                      <Link
                        href={`/admin/packages/${pkg.id}`}
                        className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100"
                      >
                        <FiEdit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => deletePackage(pkg.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
