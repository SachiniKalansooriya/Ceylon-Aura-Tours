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
    <div className="grid lg:grid-cols-3 gap-8">
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-0.5">
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
        <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
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
                    className="bg-primary-100 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer hover:bg-primary-200"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
          </div>

          {/* WhatsApp Button */}
          <button
            onClick={handleInquire}
            disabled={selected.length === 0}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-all ${
              selected.length > 0
                ? "bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg"
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
