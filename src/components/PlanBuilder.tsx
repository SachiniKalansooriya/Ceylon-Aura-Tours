"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiCheck, FiUsers, FiCalendar } from "react-icons/fi";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface Destination {
  name: string;
  slug: string;
  category: string;
}

interface PlanBuilderProps {
  destinations: Destination[];
}

export default function PlanBuilder({ destinations }: PlanBuilderProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [travelers, setTravelers] = useState<number>(2);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(destinations.map((d) => d.category)))];

  const filtered =
    activeCategory === "All"
      ? destinations
      : destinations.filter((d) => d.category === activeCategory);

  function toggleDestination(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]
    );
  }

  function handleInquire() {
    const url = buildWhatsAppUrl(selected, travelers, dateFrom, dateTo);
    window.open(url, "_blank");
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Destination Picker */}
      <div className="lg:col-span-2">
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">
          Select Your Destinations
        </h2>
        <p className="text-gray-500 mb-6">
          Pick the places you want to visit. We&apos;ll craft the perfect itinerary for you.
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-primary-900 to-primary-950 text-white shadow-md shadow-primary-900/25"
                  : "bg-white/50 backdrop-blur-sm border border-white/40 text-gray-600 hover:bg-white/70 hover:border-primary-900/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Destination Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((dest) => {
            const isSelected = selected.includes(dest.name);
            return (
              <button
                key={dest.slug}
                onClick={() => toggleDestination(dest.name)}
                className={`relative p-4 rounded-xl text-left transition-all duration-200 ${
                  isSelected
                    ? "bg-primary-900/10 border-2 border-primary-900/40 backdrop-blur-sm shadow-md shadow-primary-900/10"
                    : "bg-white/40 backdrop-blur-sm border-2 border-white/40 hover:bg-white/60 hover:border-primary-900/30"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 bg-gradient-to-r from-primary-900 to-primary-950 text-white rounded-full p-0.5 shadow-sm">
                    <FiCheck className="w-3 h-3" />
                  </span>
                )}
                <span className="font-medium text-gray-900 text-sm">
                  {dest.name}
                </span>
                <span className="block text-xs text-gray-400 mt-1">
                  {dest.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Sidebar */}
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-24 glass-card p-5 sm:p-6">
          <h3 className="font-display text-lg font-bold text-gray-900 mb-4">
            Your Trip Summary
          </h3>

          {/* Selected */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              Selected Destinations ({selected.length})
            </label>
            {selected.length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                Pick destinations from the left
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selected.map((name) => (
                  <span
                    key={name}
                    onClick={() => toggleDestination(name)}
                    className="bg-primary-900/10 text-primary-900 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer hover:bg-primary-900/20 border border-primary-900/25 transition-colors"
                  >
                    {name} &times;
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Travelers */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
              <FiUsers className="w-4 h-4" />
              Travelers
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="glass-input w-full text-sm"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                <FiCalendar className="w-3 h-3" />
                From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="glass-input w-full text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="glass-input w-full text-sm"
              />
            </div>
          </div>

          {/* WhatsApp Button */}
          <button
            onClick={handleInquire}
            disabled={selected.length === 0}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-black transition-all duration-300 ${
              selected.length > 0
                ? "bg-[#BCD5AC] shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 hover:-translate-y-0.5"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <FaWhatsapp className="w-5 h-5" />
            Inquire on WhatsApp
          </button>
          {selected.length === 0 && (
            <p className="text-xs text-gray-400 text-center mt-2">
              Select at least one destination
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
