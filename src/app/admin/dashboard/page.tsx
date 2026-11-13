"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPackage, FiMapPin, FiPlus } from "react-icons/fi";

interface Stats {
  packages: number;
  destinations: number;
  inquiries: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ packages: 0, destinations: 0, inquiries: 0 });

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 p-3 rounded-lg">
              <FiPackage className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.packages}</p>
              <p className="text-sm text-gray-500">Tour Packages</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent-100 p-3 rounded-lg">
              <FiMapPin className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.destinations}</p>
              <p className="text-sm text-gray-500">Destinations</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <FiPackage className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inquiries}</p>
              <p className="text-sm text-gray-500">Inquiries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/packages/new"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition"
        >
          <FiPlus className="w-5 h-5 text-primary-600" />
          <span className="font-medium text-gray-900">Add New Package</span>
        </Link>
        <Link
          href="/admin/destinations/new"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition"
        >
          <FiPlus className="w-5 h-5 text-primary-600" />
          <span className="font-medium text-gray-900">Add New Destination</span>
        </Link>
      </div>
    </div>
  );
}
