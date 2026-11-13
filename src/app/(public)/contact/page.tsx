import { Metadata } from "next";
import { FaWhatsapp } from "react-icons/fa";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Ceylon Paradise Tours";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteName}. Reach us on WhatsApp, phone, or email. We reply within hours.`,
};

export default function ContactPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  return (
    <div className="section-padding py-12 lg:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
          Contact Us
        </h1>
        <p className="text-gray-500 mb-10">
          Have a question or ready to plan your trip? Reach out through any of
          the channels below. We typically reply within a few hours.
        </p>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I'd like to inquire about your tours.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition group"
          >
            <FaWhatsapp className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-green-700">
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

          {/* Phone */}
          <a
            href="tel:+94771234567"
            className="flex items-start gap-4 p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition group"
          >
            <FiPhone className="w-8 h-8 text-primary-500" />
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">
                Phone
              </h3>
              <p className="text-sm text-gray-500 mt-1">Call us directly</p>
              <p className="text-sm font-medium text-primary-600 mt-2">
                +94 77 123 4567
              </p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:hello@yourdomain.com"
            className="flex items-start gap-4 p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition group"
          >
            <FiMail className="w-8 h-8 text-primary-500" />
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">
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

          {/* Office */}
          <div className="flex items-start gap-4 p-6 rounded-xl border border-gray-200">
            <FiMapPin className="w-8 h-8 text-primary-500" />
            <div>
              <h3 className="font-semibold text-gray-900">Office</h3>
              <p className="text-sm text-gray-500 mt-1">Colombo, Sri Lanka</p>
              <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                Available 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
