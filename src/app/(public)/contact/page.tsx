import { Metadata } from "next";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiSend,
  FiMessageCircle,
} from "react-icons/fi";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Ceylon Aura Tours";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteName}. Reach us on WhatsApp, phone, or email. We reply within hours.`,
};

export default function ContactPage() {
  const whatsappUrl = buildSimpleWhatsAppUrl("Hi! I'd like to inquire about your tours.");

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* ───── Hero Section ───── */}
      <section className="relative h-[45vh] sm:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-primary-950">
          <Image
            src="/images/cta-bg.jpg"
            alt=""
            fill
            className="object-cover opacity-40"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,22,40,0.95) 0%, rgba(15,30,55,0.7) 50%, rgba(20,40,70,0.5) 100%)",
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center px-6">
            <span className="inline-block text-accent-400 text-sm font-semibold uppercase tracking-[0.2em] mb-4">
              Get in Touch
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-white/60 text-lg max-w-lg mx-auto leading-relaxed">
              Ready to plan your Sri Lanka adventure? We&apos;re here to help
              you every step of the way.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#faf9f7] to-transparent" />
      </section>

      {/* ───── Main Content ───── */}
      <div className="section-padding -mt-10 relative z-20 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* ───── Left: Contact Info Cards ───── */}
            <div className="lg:col-span-2 space-y-4">
              {/* WhatsApp — Primary CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-primary-950 rounded-2xl p-6 hover:shadow-xl hover:shadow-green-500/15 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                    <FaWhatsapp className="w-7 h-7 text-accent-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg">
                      WhatsApp
                    </h3>
                    <p className="text-white/80 text-sm">
                      Fastest way to reach us
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-white font-semibold">
                    +94 752749213
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                    <FiMessageCircle className="w-3.5 h-3.5" />
                    Chat Now
                  </span>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:+94752749213"
                className="group flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 hover:border-primary-900/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-950 flex items-center justify-center flex-shrink-0">
                  <FiPhone className="w-5 h-5 text-accent-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-gray-900 text-sm">
                    Phone
                  </h3>
                  <p className="text-primary-900 font-semibold mt-0.5">
                    +94 75 274 9213
                  </p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:hello@ceylonauratours.com"
                className="group flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 hover:border-accent-300/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-950 flex items-center justify-center flex-shrink-0">
                  <FiMail className="w-5 h-5 text-accent-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-gray-900 text-sm">
                    Email
                  </h3>
                  <p className="text-primary-950 font-semibold mt-0.5">
                    hello@ceylonauratours.com
                  </p>
                </div>
              </a>

              {/* Office & Hours */}
              <div className="bg-primary-950 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiMapPin className="w-5 h-5 text-accent-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-sm">
                      Office
                    </h3>
                    <p className="text-white/60 text-sm mt-1 leading-relaxed">
                      Colombo, Sri Lanka
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiClock className="w-5 h-5 text-accent-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-sm">
                      Available
                    </h3>
                    <p className="text-white/60 text-sm mt-1">
                      24/7 — We never sleep on your trip
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ───── Right: Contact Form ───── */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <h2 className="font-display text-2xl font-bold text-accent-600 mb-2">
                  Send Us a Message
                </h2>
                <p className="text-gray-400 text-sm mb-8">
                  Fill out the form below and we&apos;ll get back to you within
                  a few hours.
                </p>

                <form className="space-y-5">
                  {/* Name & Email row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Smith"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-300 focus:border-primary-900/40 focus:ring-2 focus:ring-primary-900/10 focus:bg-white outline-none transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-300 focus:border-primary-900/40 focus:ring-2 focus:ring-primary-900/10 focus:bg-white outline-none transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Travel dates & Group size */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Travel Dates
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dec 2026"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-300 focus:border-primary-900/40 focus:ring-2 focus:ring-primary-900/10 focus:bg-white outline-none transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Group Size
                      </label>
                      <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:border-primary-900/40 focus:ring-2 focus:ring-primary-900/10 focus:bg-white outline-none transition-all duration-200 appearance-none">
                        <option value="">Select</option>
                        <option value="1">Solo traveller</option>
                        <option value="2">2 people</option>
                        <option value="3-4">3–4 people</option>
                        <option value="5-8">5–8 people</option>
                        <option value="9+">9+ people</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Tell us about your dream Sri Lanka trip — destinations, interests, budget…"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-300 focus:border-primary-900/40 focus:ring-2 focus:ring-primary-900/10 focus:bg-white outline-none transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-primary-900 text-white px-8 py-3.5 rounded-full font-bold text-base hover:bg-primary-950 transition-all duration-300 shadow-lg shadow-primary-900/15 hover:-translate-y-0.5"
                  >
                    <FiSend className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              </div>

              {/* Bottom note */}
              <div className="mt-6 bg-accent-50/50 border border-accent-200/30 rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center flex-shrink-0">
                  <FaWhatsapp className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    <span className="font-semibold text-gray-900">
                      Prefer WhatsApp?
                    </span>{" "}
                    Most of our clients reach us on WhatsApp for instant
                    replies. Tap the green button on the left or the floating
                    icon at the bottom right.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
