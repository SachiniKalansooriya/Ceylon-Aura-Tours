"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi";

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

  async function load() {
    const res = await fetch("/api/destinations");
    setDestinations(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function deleteDest(id: string) {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/destinations/${id}`, { method: "DELETE" });
    load();
  }

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/destinations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    load();
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Destinations</h1>
        <Link href="/admin/destinations/new" className="btn-primary text-sm">
          <FiPlus className="w-4 h-4" />
          Add Destination
        </Link>
      </div>

      {destinations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-400 mb-4">No destinations yet</p>
          <Link href="/admin/destinations/new" className="btn-primary text-sm"><FiPlus className="w-4 h-4" /> Add First Destination</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {destinations.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {d.name}
                    {d.featured && <span className="ml-2 text-xs bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full">Featured</span>}
                  </td>
                  <td className="py-3 px-4 text-gray-500">{d.category}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${d.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {d.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => togglePublish(d.id, d.published)} className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                        {d.published ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                      <Link href={`/admin/destinations/${d.id}`} className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100"><FiEdit className="w-4 h-4" /></Link>
                      <button onClick={() => deleteDest(d.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"><FiTrash2 className="w-4 h-4" /></button>
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
