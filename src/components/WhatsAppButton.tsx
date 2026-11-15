"use client";

import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  const url = buildSimpleWhatsAppUrl("Hi! I'd like to plan a tour.");

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50
                 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full
                 shadow-lg shadow-green-500/40"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 15 }}
      whileHover={{
        scale: 1.15,
        boxShadow: "0 10px 40px rgba(34,197,94,0.5)",
      }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <FaWhatsapp className="w-7 h-7" />
      </motion.div>
    </motion.a>
  );
}
