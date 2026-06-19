// src/app/(admin)/organizations/create/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { Spin } from "antd";

import OrganizationForm from "@/modules/organizations/components/OrganizationForm";
import { useOrganizationStore } from "@/modules/organizations/store/useOrganizationStore";

function OrganizationCreateSavingOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/75 dark:bg-gray-950/70">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
        <Spin size="large" />

        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Guardando organización...
        </p>
      </div>
    </div>
  );
}

export default function CreateOrganizationPage() {
  const router = useRouter();

  const { loading, createOrganization } = useOrganizationStore();

  const handleSubmit = async (payload: FormData) => {
    try {
      await createOrganization(payload);

      router.push("/organizations");
    } catch (error) {
      console.error("Error al crear organización:", error);
    }
  };

  const handleCancel = () => {
    router.push("/organizations");
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        {loading && <OrganizationCreateSavingOverlay />}

        <OrganizationForm
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}