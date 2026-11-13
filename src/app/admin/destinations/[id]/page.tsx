"use client";

import { useEffect, useState, use } from "react";
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

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>;
  if (!dest) return <p className="text-gray-500">Destination not found</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Destination</h1>
      <DestinationForm initialData={dest as unknown as Parameters<typeof DestinationForm>[0]["initialData"]} />
    </div>
  );
}
