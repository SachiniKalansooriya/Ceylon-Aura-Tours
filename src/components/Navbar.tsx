"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Ceylon Paradise Tours";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Tour Packages" },
  { href: "/destinations", label: "Destinations" },
  { href: "/plan", label: "Plan Your Trip" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/* Animated hamburger → X icon */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-6 h-5 relative flex flex-col justify-between">
      <motion.span
        className="block h-0.5 w-6 bg-gray-600 rounded-full origin-left"
        animate={open ? { rotate: 45, x: 2, y: -1 } : { rotate: 0, x: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
      <motion.span
        className="block h-0.5 w-6 bg-gray-600 rounded-full"
        animate={open ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="block h-0.5 w-6 bg-gray-600 rounded-full origin-left"
        animate={open ? { rotate: -45, x: 2, y: 1 } : { rotate: 0, x: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}

/* Menu item animation variants */
const menuItemVariants = {
  closed: { opacity: 0, x: -20, y: 0 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      delay: 0.05 + i * 0.07,
      duration: 0.4,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    x: -20,
    transition: {
      delay: i * 0.03,
      duration: 0.2,
    },
  }),
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  /* Add shadow on scroll */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`glass sticky top-0 z-50 border-b border-white/20 transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-black/5" : ""
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <nav className="section-padding">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.span
              className="text-2xl"
              whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              🌴
            </motion.span>
            <span className="font-display text-xl lg:text-2xl font-bold text-gradient-dark">
              {siteName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-gray-600 hover:text-primary-600 font-medium transition-colors text-sm group"
              >
                {link.label}
                {/* Animated underline */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <motion.a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'd like to plan a tour.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-sm py-2 px-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiMessageCircle className="w-4 h-4" />
              Plan on WhatsApp
            </motion.a>
          </div>

          {/* Mobile Toggle — Animated Hamburger */}
          <motion.button
            className="lg:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <HamburgerIcon open={open} />
          </motion.button>
        </div>

        {/* Mobile Nav — Animated */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="lg:hidden overflow-hidden border-t border-white/20 mt-2 bg-white/40 backdrop-blur-lg rounded-b-2xl -mx-4 px-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="py-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    custom={i}
                    variants={menuItemVariants}
                    initial="closed"
                    animate="open"
                    exit="exit"
                  >
                    <Link
                      href={link.href}
                      className="block py-3 px-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50/50 font-medium rounded-xl transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  custom={navLinks.length}
                  variants={menuItemVariants}
                  initial="closed"
                  animate="open"
                  exit="exit"
                >
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'd like to plan a tour.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp text-sm mt-3 w-full justify-center"
                  >
                    <FiMessageCircle className="w-4 h-4" />
                    Plan on WhatsApp
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
