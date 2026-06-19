// src/app/(admin)/organizations/[uuid]/edit/page.tsx

"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Spin } from "antd";

import OrganizationForm from "@/modules/organizations/components/OrganizationForm";
import { useOrganizationStore } from "@/modules/organizations/store/useOrganizationStore";

function OrganizationEditInitialLoading() {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col items-center gap-4">
        <Spin size="large" />

        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Cargando organización...
        </p>
      </div>
    </div>
  );
}

function OrganizationEditSavingOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/75 dark:bg-gray-950/70">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
        <Spin size="large" />

        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Guardando cambios...
        </p>
      </div>
    </div>
  );
}

function OrganizationEditWarningMessage({ message }: { message: string }) {
  return (
    <Alert
      message={message}
      type="warning"
      showIcon
      className="
        rounded-xl
        border-warning-200
        bg-warning-50
        text-warning-700
        shadow-none
        dark:border-warning-500/20
        dark:bg-warning-500/10
        dark:text-warning-400
        [&_.ant-alert-message]:text-warning-700
        dark:[&_.ant-alert-message]:text-warning-400
      "
    />
  );
}

export default function EditOrganizationPage() {
  const router = useRouter();
  const params = useParams();

  const uuid = String(params.uuid ?? "");

  const {
    organization,
    loading,
    fetchOrganization,
    updateOrganization,
    clearOrganization,
  } = useOrganizationStore();

  useEffect(() => {
    if (uuid) {
      fetchOrganization(uuid);
    }

    return () => {
      clearOrganization();
    };
  }, [uuid, fetchOrganization, clearOrganization]);

  const handleSubmit = async (payload: FormData) => {
    try {
      await updateOrganization(uuid, payload);

      router.push("/organizations");
    } catch (error) {
      console.error("Error al actualizar organización:", error);
    }
  };

  const handleCancel = () => {
    router.push("/organizations");
  };

  if (loading && !organization) {
    return <OrganizationEditInitialLoading />;
  }

  if (!loading && !organization) {
    return (
      <OrganizationEditWarningMessage message="No se encontró la organización." />
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        {loading && <OrganizationEditSavingOverlay />}

        <OrganizationForm
          initialData={organization}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}