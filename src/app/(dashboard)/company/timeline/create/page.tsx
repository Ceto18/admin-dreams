"use client";

import { useRouter } from "next/navigation";

import { useCompanyTimelineStore } from "@/modules/company/store/useCompanyTimelineStore";

import type { CompanyTimelinePayload } from "@/modules/company/types";
import CompanyTimelineForm from "@/modules/company/components/timeline/form/CompanyTimelineForm";

export default function CompanyTimelineCreatePage() {
  const router = useRouter();

  const {
    loading,
    createTimeline,
  } = useCompanyTimelineStore();

  const handleSubmit = async (
    payload: CompanyTimelinePayload
  ) => {
    try {
      await createTimeline(payload);

      router.push("/company/timeline");
    } catch {
      // El error ya se maneja en el store.
    }
  };

  const handleBack = () => {
    if (loading) return;

    router.push("/company/timeline");
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-20 left-20 h-48 w-48 rounded-full bg-brand-300/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              Línea de tiempo
            </span>

            <h1 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white/90 md:text-3xl">
              Crear acontecimiento
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
              Completa la información para registrar un nuevo acontecimiento
              dentro de la historia de la empresa.
            </p>
          </div>

          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          >
            Volver
          </button>
        </div>
      </div>

      <CompanyTimelineForm
        initialData={null}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}