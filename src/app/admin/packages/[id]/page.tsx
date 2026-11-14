"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900" />
      </div>
    );
  }

  if (!pkg) return <p className="text-gray-500">Package not found</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Link
          href="/admin/packages"
          className="w-9 h-9 rounded-xl bg-primary-900 text-white flex items-center justify-center hover:bg-primary-950 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Package</h1>
      </div>
      <PackageForm
        initialData={
          pkg as unknown as Parameters<typeof PackageForm>[0]["initialData"]
        }
      />
    </div>
  );
}