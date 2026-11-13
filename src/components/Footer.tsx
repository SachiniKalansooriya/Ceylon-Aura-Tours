import Link from "next/link";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Ceylon Paradise Tours";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-bold text-white mb-4">
              🌴 {siteName}
            </h3>
            <p className="text-sm leading-relaxed">
              Discover the beauty of Sri Lanka with our carefully crafted tour
              packages. Private tours, trusted drivers, unforgettable
              experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/packages" className="hover:text-white transition-colors">Tour Packages</Link></li>
              <li><Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link></li>
              <li><Link href="/plan" className="hover:text-white transition-colors">Plan Your Trip</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="font-semibold text-white mb-4">Top Destinations</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/destinations/sigiriya" className="hover:text-white transition-colors">Sigiriya</Link></li>
              <li><Link href="/destinations/kandy" className="hover:text-white transition-colors">Kandy</Link></li>
              <li><Link href="/destinations/ella" className="hover:text-white transition-colors">Ella</Link></li>
              <li><Link href="/destinations/galle" className="hover:text-white transition-colors">Galle</Link></li>
              <li><Link href="/destinations/yala" className="hover:text-white transition-colors">Yala</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <FiPhone className="w-4 h-4 text-primary-400" />
                <a href="tel:+94771234567" className="hover:text-white transition-colors">
                  +94 77 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="w-4 h-4 text-primary-400" />
                <a href="mailto:hello@yourdomain.com" className="hover:text-white transition-colors">
                  hello@yourdomain.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FiMapPin className="w-4 h-4 text-primary-400 mt-0.5" />
                <span>Colombo, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
