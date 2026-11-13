import { Metadata } from "next";
import { FiCheckCircle } from "react-icons/fi";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Ceylon Paradise Tours";

export const metadata: Metadata = {
  title: "About Us | Our Story",
  description: `Learn about ${siteName}. We are a licensed Sri Lankan tour operator offering private, customizable tours across the island.`,
};

export default function AboutPage() {
  return (
    <div className="section-padding py-12 lg:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-6">
          About {siteName}
        </h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-gray-600 leading-relaxed">
            We are a licensed Sri Lankan tour operator dedicated to creating
            unforgettable travel experiences. Every tour is private, fully
            customizable, and led by experienced local drivers who know the
            island inside out.
          </p>

          <p className="text-gray-600 leading-relaxed mt-4">
            Whether you&apos;re chasing ancient ruins in Anuradhapura, spotting
            leopards in Yala, riding the scenic train through Ella, or soaking
            up the sun on the southern coast, we&apos;ll design the perfect
            itinerary around your interests, your pace, and your budget.
          </p>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
            Why Travel With Us
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Licensed and registered operator",
              "Private tours — just you and your group",
              "Experienced, English-speaking drivers",
              "Fully customizable itineraries",
              "24/7 WhatsApp support",
              "No hidden costs or shop stops",
              "Flexible payment options",
              "Free cancellation on most bookings",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-gray-700"
              >
                <FiCheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
