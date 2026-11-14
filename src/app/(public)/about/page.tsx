import { Metadata } from "next";
import { FiCheckCircle } from "react-icons/fi";
import ScrollReveal from "@/components/motion/ScrollReveal";
import PageHero from "@/components/PageHero";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Ceylon Aura Tours";

export const metadata: Metadata = {
  title: "About Us | Our Story",
  description: `Learn about ${siteName}. We are a licensed Sri Lankan tour operator offering private, customizable tours across the island.`,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        label="Our Story"
        title={`${siteName}`}
        description="We are a licensed Sri Lankan tour operator dedicated to creating unforgettable travel experiences."
      />

      <div className="section-padding section-spacing">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal delay={0.1}>
            <div className="mb-14">
              <p className="text-lg text-gray-600 leading-relaxed">
                Every tour is private, fully customizable, and led by experienced
                local drivers who know the island inside out.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Whether you&apos;re chasing ancient ruins in Anuradhapura, spotting
                leopards in Yala, riding the scenic train through Ella, or soaking
                up the sun on the southern coast, we&apos;ll design the perfect
                itinerary around your interests, your pace, and your budget.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <span className="section-label">Why Us</span>
            <h2 className="heading-section text-2xl mb-8">
              Why Travel With Us
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Licensed and registered operator",
              "Private tours — just you and your group",
              "Experienced, English-speaking drivers",
              "Fully customizable itineraries",
              "24/7 WhatsApp support",
              "No hidden costs or shop stops",
              "Flexible payment options",
              "Free cancellation on most bookings",
            ].map((item, i) => (
              <ScrollReveal
                key={item}
                delay={0.1 + i * 0.07}
                direction={i % 2 === 0 ? "left" : "right"}
              >
                <div className="flex items-center gap-3 text-gray-700 bg-white rounded-2xl border border-gray-100 p-4 hover:border-accent-200 hover:shadow-sm transition-all duration-200">
                  <FiCheckCircle className="w-5 h-5 text-accent-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
