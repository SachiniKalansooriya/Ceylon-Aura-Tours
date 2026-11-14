"use client";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import DestinationForm from "@/components/DestinationForm";

export default function NewDestinationPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Link
          href="/admin/destinations"
          className="w-9 h-9 rounded-xl bg-primary-900 text-white flex items-center justify-center hover:bg-primary-950 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Destination</h1>
      </div>
      <DestinationForm />
    </div>
  );
}