"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX, FiMessageCircle } from "react-icons/fi";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Ceylon Paradise Tours";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Tour Packages" },
  { href: "/destinations", label: "Destinations" },
  { href: "/plan", label: "Plan Your Trip" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
      <nav className="section-padding">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌴</span>
            <span className="font-display text-xl lg:text-2xl font-bold text-primary-700">
              {siteName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'd like to plan a tour.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-sm py-2 px-4"
            >
              <FiMessageCircle className="w-4 h-4" />
              Plan on WhatsApp
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {open && (
          <div className="lg:hidden pb-4 border-t border-gray-100 mt-2 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 px-2 text-gray-600 hover:text-primary-600 font-medium"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'd like to plan a tour.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-sm mt-3 w-full justify-center"
            >
              <FiMessageCircle className="w-4 h-4" />
              Plan on WhatsApp
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
