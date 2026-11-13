"use client";

import Link from "next/link";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Ceylon Paradise Tours";

const footerColumns = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
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
  return (
    <footer className="glass-dark text-gray-300">
      <div className="section-padding py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={footerColumns}
        >
          {/* Brand */}
          <motion.div variants={footerCol}>
            <h3 className="font-display text-xl font-bold text-white mb-4">
              🌴 {siteName}
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Discover the beauty of Sri Lanka with our carefully crafted tour
              packages. Private tours, trusted drivers, unforgettable
              experiences.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={footerCol}>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/packages" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-all duration-200">Tour Packages</Link></li>
              <li><Link href="/destinations" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-all duration-200">Destinations</Link></li>
              <li><Link href="/plan" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-all duration-200">Plan Your Trip</Link></li>
              <li><Link href="/about" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-all duration-200">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-all duration-200">Contact</Link></li>
            </ul>
          </motion.div>

          {/* Popular Destinations */}
          <motion.div variants={footerCol}>
            <h4 className="font-semibold text-white mb-4">Top Destinations</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/destinations/sigiriya" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-all duration-200">Sigiriya</Link></li>
              <li><Link href="/destinations/kandy" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-all duration-200">Kandy</Link></li>
              <li><Link href="/destinations/ella" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-all duration-200">Ella</Link></li>
              <li><Link href="/destinations/galle" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-all duration-200">Galle</Link></li>
              <li><Link href="/destinations/yala" className="hover:text-primary-400 hover:translate-x-1 inline-block transition-all duration-200">Yala</Link></li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={footerCol}>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <FiPhone className="w-4 h-4 text-primary-400" />
                <a href="tel:+94771234567" className="hover:text-primary-400 transition-colors">
                  +94 77 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="w-4 h-4 text-primary-400" />
                <a href="mailto:hello@yourdomain.com" className="hover:text-primary-400 transition-colors">
                  hello@yourdomain.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FiMapPin className="w-4 h-4 text-primary-400 mt-0.5" />
                <span>Colombo, Sri Lanka</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="border-t border-white/10 mt-12 pt-8 text-sm text-center text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
