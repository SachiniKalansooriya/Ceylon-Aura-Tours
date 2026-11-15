"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { FiPhone, FiMail, FiMapPin, FiArrowUpRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Ceylon Aura Tours";

const footerColumns = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const footerCol = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

export default function Footer() {
  const whatsappUrl = buildSimpleWhatsAppUrl("Hi! I'd like to plan a tour of Sri Lanka.");

  return (
    <footer className="relative text-white">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/footer-bg.jpg')" }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10">
        {/* Top CTA band */}
        <div className="border-b border-white/10">
          <div className="section-padding py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-700 text-white">
                Start planning your Sri Lanka trip
              </h3>
              <p className="text-sm text-white/50 mt-1">
                Free quote — no obligation. We reply within hours.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#BCD5AC] text-black text-sm font-semibold px-6 py-3 rounded-full hover:bg-accent-600 transition-colors shadow-lg shadow-accent-500/15 flex-shrink-0"
            >
              <FaWhatsapp className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="section-padding py-14">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={footerColumns}
          >
            {/* Brand */}
            <motion.div className="col-span-2 md:col-span-1 flex items-center" variants={footerCol}>
              <img
                src="/images/logo-ceylon-aura.png"
                alt="Ceylon Aura Tours"
                className="w-full max-w-[220px] h-auto"
              />
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={footerCol}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-accent-400/70 mb-4">
                Navigation
              </h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  { href: "/packages", label: "Tour Packages" },
                  { href: "/destinations", label: "Destinations" },
                  { href: "/plan", label: "Plan Your Trip" },
                  { href: "/about", label: "About Us" },
                  { href: "/contact", label: "Contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-accent-400 transition-colors duration-200 inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <FiArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-y-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Destinations */}
            <motion.div variants={footerCol}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-accent-400/70 mb-4">
                Top Destinations
              </h4>
              <ul className="space-y-2.5 text-sm">
                {["Sigiriya", "Kandy", "Ella", "Galle", "Yala"].map((dest) => (
                  <li key={dest}>
                    <Link
                      href={`/destinations/${dest.toLowerCase()}`}
                      className="text-white/60 hover:text-accent-400 transition-colors duration-200"
                    >
                      {dest}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div variants={footerCol}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-accent-400/70 mb-4">
                Get in Touch
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <FiPhone className="w-4 h-4 text-accent-400/60" />
                  <a href="tel:+94771234567" className="text-white/60 hover:text-accent-400 transition-colors">
                    +94 77 123 4567
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <FiMail className="w-4 h-4 text-accent-400/60" />
                  <a href="mailto:hello@yourdomain.com" className="text-white/60 hover:text-accent-400 transition-colors">
                    hello@yourdomain.com
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <FiMapPin className="w-4 h-4 text-accent-400/60 mt-0.5" />
                  <span className="text-white/60">Galle, Sri Lanka</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Copyright */}
          <motion.div
            className="border-t border-white/10 mt-12 pt-8 text-xs text-center text-white/30"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p>
              &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
