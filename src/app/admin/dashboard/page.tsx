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
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        <div className="glass-card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-primary-900 to-primary-950 p-3 rounded-xl shadow-lg shadow-primary-900/20">
              <FiPackage className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.packages}</p>
              <p className="text-sm text-gray-500">Tour Packages</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-accent-500 to-accent-600 p-3 rounded-xl shadow-lg shadow-accent-500/20">
              <FiMapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.destinations}</p>
              <p className="text-sm text-gray-500">Destinations</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg shadow-green-500/20">
              <FiPackage className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.inquiries}</p>
              <p className="text-sm text-gray-500">Inquiries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/packages/new"
          className="glass-card flex items-center gap-3 p-4 hover:bg-primary-50/50"
        >
          <div className="bg-primary-900/10 p-2 rounded-lg">
            <FiPlus className="w-5 h-5 text-primary-900" />
          </div>
          <span className="font-medium text-gray-900">Add New Package</span>
        </Link>
        <Link
          href="/admin/destinations/new"
          className="glass-card flex items-center gap-3 p-4 hover:bg-primary-50/50"
        >
          <div className="bg-primary-900/10 p-2 rounded-lg">
            <FiPlus className="w-5 h-5 text-primary-900" />
          </div>
          <span className="font-medium text-gray-900">Add New Destination</span>
        </Link>
      </div>
    </div>
  );
}
