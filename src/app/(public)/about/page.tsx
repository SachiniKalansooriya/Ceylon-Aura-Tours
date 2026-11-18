import { Metadata } from "next";
import { FiCheckCircle, FiMapPin, FiUsers, FiHeart, FiShield, FiStar, FiClock } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import ScrollReveal from "@/components/motion/ScrollReveal";
import PageHero from "@/components/PageHero";
import Link from "next/link";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Ceylon Elephant Tours";

export const metadata: Metadata = {
  title: "About Us | Our Story",
  description: `Learn about ${siteName}. We offer private, fully customizable tours across Sri Lanka — led by experienced local drivers who know the island inside out.`,
};

const values = [
  {
    icon: FiHeart,
    title: "Private & Personal",
    description:
      "Every tour is private — just you and your group. No crowded buses, no rigid schedules. Your trip, your way.",
  },
  {
    icon: FiUsers,
    title: "Experienced Local Drivers",
    description:
      "Our drivers aren't just behind the wheel — they're your storytellers, food guides, and connection to the real Sri Lanka.",
  },
  {
    icon: FiMapPin,
    title: "Fully Customizable",
    description:
      "We design the perfect itinerary around your interests, your pace, and your budget. Every detail is tailored to you.",
  },
  {
    icon: FiShield,
    title: "No Hidden Costs",
    description:
      "What we quote is what you pay. No surprise shop stops, no tricks — just honest, reliable service from start to finish.",
  },
];

const whyUsPoints = [
  "Every tour is private — just you and your group",
  "Fully customizable itineraries",
  "Experienced, English-speaking local drivers",
  "No hidden costs or forced shopping stops",
  "24/7 WhatsApp support throughout your trip",
  "Airport pickup & drop-off included",
  "Flexible payment options",
  "Child-friendly and senior-friendly options",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        label="Our Story"
        title="Your Sri Lanka, Your Way"
        description="Private, fully customizable tours led by experienced local drivers who know the island inside out."
      />

      {/* ───── Our Story ───── */}
      <section className="section-padding section-spacing">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal delay={0.1}>
            <span className="section-label">Who We Are</span>
            <h2 className="heading-section text-3xl sm:text-4xl mb-8">
              More Than a Tour Company —<br />
              <span className="text-accent-500">Your Local Friend in Sri Lanka</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="space-y-5 text-gray-600 leading-relaxed">
              <p className="text-lg">
                At <strong className="text-primary-950">{siteName}</strong>, every tour is <strong className="text-primary-950">private, fully customizable, and led by experienced local drivers</strong> who know the island inside out.
              </p>
              <p>
                Whether you&apos;re chasing ancient ruins in Anuradhapura, spotting leopards in Yala, riding the scenic train through Ella, or soaking up the sun on the southern coast — we&apos;ll design the perfect itinerary around <strong className="text-primary-950">your interests, your pace, and your budget</strong>.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ───── Our Values ───── */}
      <section className="bg-primary-950/[0.03] py-16 lg:py-24">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal delay={0.1}>
              <span className="section-label">What Sets Us Apart</span>
              <h2 className="heading-section text-3xl sm:text-4xl mb-12">
                Built on <span className="text-accent-500">Trust</span>, Not Just Routes
              </h2>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((value, i) => (
                <ScrollReveal
                  key={value.title}
                  delay={0.1 + i * 0.1}
                  direction={i % 2 === 0 ? "left" : "right"}
                >
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-accent-200 hover:shadow-lg transition-all duration-300 h-full">
                    <div className="w-12 h-12 rounded-xl bg-primary-950 flex items-center justify-center mb-4">
                      <value.icon className="w-5 h-5 text-accent-400" />
                    </div>
                    <h3 className="text-lg font-bold text-primary-950 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── Why Travel With Us ───── */}
      <section className="section-padding section-spacing">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal delay={0.1}>
            <span className="section-label">Why Choose Us</span>
            <h2 className="heading-section text-3xl sm:text-4xl mb-10">
              Why Travelers <span className="text-accent-500">Trust Us</span>
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-3">
            {whyUsPoints.map((item, i) => (
              <ScrollReveal
                key={item}
                delay={0.1 + i * 0.06}
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
      </section>

      {/* ───── How It Works ───── */}
      <section className="bg-primary-950 py-16 lg:py-24">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal delay={0.1}>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent-400 mb-3 block">
                Simple Process
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-800 text-white mb-12">
                How It <span className="text-accent-400">Works</span>
              </h2>
            </ScrollReveal>

            <div className="grid sm:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  icon: FaWhatsapp,
                  title: "Tell Us Your Dream",
                  description:
                    "Message us on WhatsApp or fill out our trip planner. Tell us your dates, interests, and budget.",
                },
                {
                  step: "02",
                  icon: FiMapPin,
                  title: "We Design Your Trip",
                  description:
                    "We'll craft a personalized itinerary just for you. Want changes? We'll tweak it until it's perfect.",
                },
                {
                  step: "03",
                  icon: FiStar,
                  title: "Enjoy Sri Lanka",
                  description:
                    "Your private driver picks you up, and the adventure begins. Relax, explore, and make memories.",
                },
              ].map((item, i) => (
                <ScrollReveal key={item.step} delay={0.1 + i * 0.15}>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5">
                      <item.icon className="w-7 h-7 text-accent-400" />
                    </div>
                    <div className="text-accent-400/40 font-display text-5xl font-800 mb-2">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="section-padding section-spacing">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal delay={0.1}>
            <h2 className="heading-section text-3xl sm:text-4xl mb-6">
              Ready to Explore <span className="text-accent-500">Sri Lanka</span>?
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Tell us where you want to go and we&apos;ll handle the rest. Your perfect Sri Lanka trip is just one message away.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/plan"
                className="inline-flex items-center gap-2 bg-primary-950 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-primary-900 transition-colors shadow-lg"
              >
                <FiClock className="w-4 h-4" />
                Plan Your Trip
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border-2 border-primary-950 text-primary-950 font-semibold px-8 py-3.5 rounded-full hover:bg-primary-950 hover:text-white transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}