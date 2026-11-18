"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Ceylon Aura Travels";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/destinations", label: "Destinations" },
  { href: "/plan", label: "Plan Trip" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-6 h-5 relative flex flex-col justify-between">
      <motion.span
        className="block h-0.5 w-6 bg-current rounded-full origin-left"
        animate={open ? { rotate: 45, x: 2, y: -1 } : { rotate: 0, x: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
      <motion.span
        className="block h-0.5 w-6 bg-current rounded-full"
        animate={open ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="block h-0.5 w-6 bg-current rounded-full origin-left"
        animate={open ? { rotate: -45, x: 2, y: 1 } : { rotate: 0, x: 0, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}

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
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const whatsappUrl = buildSimpleWhatsAppUrl("Hi! I'd like to plan a tour.");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Transparent on top, solid white when scrolled — same on every page
  const showSolid = scrolled;

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showSolid
          ? "bg-white/95 backdrop-blur-2xl shadow-lg shadow-black/[.04] border-b border-gray-100"
          : "bg-black/40 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <nav className="section-padding">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
<Link href="/" className="flex items-center gap-3 group">
  <img
    src="/images/ceylon_elephant_tours_logo.png"
    alt="Ceylon Elephant Tours"
    className={`rounded-full object-cover border-2 shadow-md transition-all duration-300 ${
      showSolid
        ? "h-11 w-11 lg:h-13 lg:w-13 border-primary-900/20"
        : "h-10 w-10 lg:h-12 lg:w-12 border-white/30"
    }`}
  />
  <div>
    <span className={`font-display text-lg font-700 tracking-tight transition-colors duration-300 ${
      showSolid ? "text-primary-950" : "text-white"
    }`}>
      Ceylon <span className={`transition-colors duration-300 ${showSolid ? "text-accent-500" : "text-accent-400"}`}>Elephant</span>
    </span>
    <span className={`block text-[9px] font-bold uppercase tracking-[0.25em] -mt-0.5 transition-colors duration-300 ${
      showSolid ? "text-gray-400" : "text-white/50"
    }`}>
      Tours
    </span>
  </div>
</Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`font-medium text-sm px-4 py-2 rounded-full transition-all duration-300 ${
                  showSolid
                    ? isActive(link.href)
                      ? "text-primary-900 bg-primary-50"
                      : "text-gray-600 hover:text-primary-900 hover:bg-primary-50"
                    : isActive(link.href)
                      ? "text-white bg-white/10"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 inline-flex items-center gap-2 bg-[#BCD5AC] text-black text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-green-600 transition-colors shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaWhatsapp className="w-4 h-4" />
              WhatsApp
            </motion.a>
          </div>

          {/* Mobile Toggle */}
          <motion.button
            className={`lg:hidden p-2 transition-colors ${
              showSolid ? "text-gray-700" : "text-white"
            }`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <HamburgerIcon open={open} />
          </motion.button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-xl rounded-3xl mt-2 -mx-2 border border-gray-100 shadow-xl"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <div className="p-4">
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
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={`block py-3 px-4 font-medium rounded-2xl transition-colors ${
                        isActive(link.href)
                          ? "text-primary-900 bg-primary-50"
                          : "text-gray-700 hover:text-primary-900 hover:bg-primary-50"
                      }`}
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
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-500 text-white text-sm font-semibold w-full py-3 rounded-2xl mt-3 hover:bg-green-600 transition-colors"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    Chat on WhatsApp
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
