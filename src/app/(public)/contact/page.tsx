import { Metadata } from "next";
import { FaWhatsapp } from "react-icons/fa";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { PageHeader } from "@/components/motion/PageTransition";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Ceylon Paradise Tours";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteName}. Reach us on WhatsApp, phone, or email. We reply within hours.`,
};

export default function ContactPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  return (
    <div className="bg-mesh-light min-h-screen">
      <div className="section-padding py-12 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <PageHeader>
            <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-gray-500 mb-10">
              Have a question or ready to plan your trip? Reach out through any of
              the channels below. We typically reply within a few hours.
            </p>
          </PageHeader>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {/* WhatsApp */}
            <ScrollReveal delay={0.1} direction="left">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'd like to inquire about your tours.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card flex items-start gap-4 p-6 hover:bg-green-50/50 group transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg shadow-green-500/20">
                  <FaWhatsapp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                    WhatsApp
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Fastest way to reach us
                  </p>
                  <p className="text-sm font-medium text-green-600 mt-2">
                    +94 77 123 4567
                  </p>
                </div>
              </a>
            </ScrollReveal>

            {/* Phone */}
            <ScrollReveal delay={0.2} direction="right">
              <a
                href="tel:+94771234567"
                className="glass-card flex items-start gap-4 p-6 hover:bg-primary-50/50 group transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-xl shadow-lg shadow-primary-500/20">
                  <FiPhone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                    Phone
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Call us directly</p>
                  <p className="text-sm font-medium text-primary-600 mt-2">
                    +94 77 123 4567
                  </p>
                </div>
              </a>
            </ScrollReveal>

            {/* Email */}
            <ScrollReveal delay={0.3} direction="left">
              <a
                href="mailto:hello@yourdomain.com"
                className="glass-card flex items-start gap-4 p-6 hover:bg-primary-50/50 group transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-accent-500 to-accent-600 p-3 rounded-xl shadow-lg shadow-accent-500/20">
                  <FiMail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                    Email
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    For detailed inquiries
                  </p>
                  <p className="text-sm font-medium text-primary-600 mt-2">
                    hello@yourdomain.com
                  </p>
                </div>
              </a>
            </ScrollReveal>

            {/* Office */}
            <ScrollReveal delay={0.4} direction="right">
              <div className="glass-card flex items-start gap-4 p-6 transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-r from-coral-500 to-coral-600 p-3 rounded-xl shadow-lg shadow-coral-500/20">
                  <FiMapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Office</h3>
                  <p className="text-sm text-gray-500 mt-1">Colombo, Sri Lanka</p>
                  <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    Available 24/7
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
