"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import DestinationForm from "@/components/DestinationForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditDestinationPage({ params }: Props) {
  const { id } = use(params);
  const [dest, setDest] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/destinations/${id}`)
      .then((r) => r.json())
      .then((data) => { setDest(data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900" /></div>;
  if (!dest) return <p className="text-gray-500">Destination not found</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Link
          href="/admin/destinations"
          className="w-9 h-9 rounded-xl bg-primary-900 text-white flex items-center justify-center hover:bg-primary-950 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Destination</h1>
      </div>
      <DestinationForm initialData={dest as unknown as Parameters<typeof DestinationForm>[0]["initialData"]} />
    </div>
  );
}