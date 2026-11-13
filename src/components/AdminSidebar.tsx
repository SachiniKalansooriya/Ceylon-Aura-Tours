"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FiGrid, FiPackage, FiMapPin, FiLogOut, FiArrowLeft } from "react-icons/fi";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FiGrid },
  { href: "/admin/packages", label: "Packages", icon: FiPackage },
  { href: "/admin/destinations", label: "Destinations", icon: FiMapPin },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-white font-display font-bold text-lg">Admin Panel</h2>
        <p className="text-xs text-gray-500 mt-1">Manage your tours</p>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-primary-600 text-white"
                  : "hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 mt-auto pt-6 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-red-900/30 hover:text-red-400 transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
