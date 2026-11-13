"use client";

import PackageForm from "@/components/PackageForm";

export default function NewPackagePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Add New Package</h1>
      <PackageForm />
    </div>
  );
}
