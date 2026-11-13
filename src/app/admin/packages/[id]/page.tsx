"use client";

import { useEffect, useState, use } from "react";
import PackageForm from "@/components/PackageForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditPackagePage({ params }: Props) {
  const { id } = use(params);
  const [pkg, setPkg] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/packages/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setPkg(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!pkg) return <p className="text-gray-500">Package not found</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Package</h1>
      <PackageForm
        initialData={
          pkg as unknown as Parameters<typeof PackageForm>[0]["initialData"]
        }
      />
    </div>
  );
}
