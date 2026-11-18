"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { buildSimpleWhatsAppUrl } from "@/lib/whatsapp";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-300 focus:border-primary-900/40 focus:ring-2 focus:ring-primary-900/10 focus:bg-white outline-none transition-all duration-200";

const groupLabels: Record<string, string> = {
  "1": "Solo traveller",
  "2": "2 people",
  "3-4": "3–4 people",
  "5-8": "5–8 people",
  "9+": "9+ people",
};

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    dates: "",
    groupSize: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const details = [
      `Name: ${form.name.trim()}`,
      form.email.trim() && `Email: ${form.email.trim()}`,
      form.dates.trim() && `Travel dates: ${form.dates.trim()}`,
      form.groupSize && `Group size: ${groupLabels[form.groupSize] ?? form.groupSize}`,
    ].filter(Boolean);

    const text = [
      "Hi! I'd like to inquire about a tour.",
      "",
      ...details,
      "",
      form.message.trim(),
    ].join("\n");

    const url = buildSimpleWhatsAppUrl(text);

    // Open WhatsApp in a new tab; fall back to same tab if pop-ups are blocked
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = url;
    setSent(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name & Email row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Full Name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={form.name}
            onChange={update("name")}
            placeholder="John Smith"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="john@example.com"
            className={inputClass}
          />
        </div>
      </div>

      {/* Travel dates & Group size */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-dates" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Travel Dates
          </label>
          <input
            id="contact-dates"
            type="text"
            value={form.dates}
            onChange={update("dates")}
            placeholder="e.g. Dec 2026"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-group" className="block text-sm font-semibold text-gray-700 mb-1.5">
            Group Size
          </label>
          <select
            id="contact-group"
            value={form.groupSize}
            onChange={update("groupSize")}
            className={`${inputClass} appearance-none`}
          >
            <option value="">Select</option>
            {Object.entries(groupLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700 mb-1.5">
          Your Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          required
          value={form.message}
          onChange={update("message")}
          placeholder="Tell us about your dream Sri Lanka trip — destinations, interests, budget…"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-primary-900 text-white px-8 py-3.5 rounded-full font-bold text-base hover:bg-primary-950 transition-all duration-300 shadow-lg shadow-primary-900/15 hover:-translate-y-0.5"
        >
          <FaWhatsapp className="w-5 h-5" />
          Send via WhatsApp
        </button>
        {sent && (
          <p className="text-sm text-gray-500 text-center sm:text-left">
            WhatsApp opened with your message — just tap send there.
          </p>
        )}
      </div>
    </form>
  );
}
