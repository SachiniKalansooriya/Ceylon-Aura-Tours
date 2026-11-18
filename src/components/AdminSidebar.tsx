"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FiGrid, FiPackage, FiMapPin, FiLogOut, FiArrowLeft, FiMenu, FiX, FiAlertTriangle, FiTag } from "react-icons/fi";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FiGrid },
  { href: "/admin/packages", label: "Packages", icon: FiPackage },
  { href: "/admin/destinations", label: "Destinations", icon: FiMapPin },
  { href: "/admin/categories", label: "Categories", icon: FiTag },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close the drawer with Escape, and when the screen grows to desktop size
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onResize = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
    };
  }, [open]);

  const current = links.find((l) => pathname.startsWith(l.href));

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-16 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 px-4 flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors shrink-0"
        >
          <FiMenu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 leading-none">Admin Panel</p>
          <h2 className="text-white font-display font-bold text-base truncate mt-1">{current?.label ?? "Admin"}</h2>
        </div>
      </div>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-72 max-w-[85vw] lg:w-64 h-[100dvh]
          glass-sidebar text-gray-300 p-6 flex flex-col overflow-y-auto overscroll-contain
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="mb-8 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-white font-display font-bold text-lg">Admin Panel</h2>
            <p className="text-xs text-gray-500 mt-1">Manage your tours</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="lg:hidden w-9 h-9 -mr-2 -mt-1 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-white/10 text-white"
                    : "hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 mt-auto pt-6 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <FiArrowLeft className="w-5 h-5" />
            View Site
          </Link>
          <button
            onClick={() => setShowLogout(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
          >
            <FiLogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ───── Sign Out Confirmation Modal ───── */}
      {showLogout && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogout(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowLogout(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <FiLogOut className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Sign Out
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to sign out of the admin panel?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/admin" })}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <FiLogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}