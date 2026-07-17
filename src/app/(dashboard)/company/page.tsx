// src/app/(dashboard)/company/page.tsx

"use client";

import { useEffect } from "react";
import { Spin } from "antd";
import { useCompanyStore } from "@/modules/company/store/useCompanyStore";

import type { CompanyPayload } from "@/modules/company/types";
import CompanyForm from "@/modules/company/components/form/CompanyForm";

function PageLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
        <Spin size="large" />

        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Cargando información de la empresa...
        </span>
      </div>
    </div>
  );
}

export default function CompanyPage() {
  const {
    company,
    loading,
    updating,
    fetchCompany,
    updateCompany,
    clearCompany,
  } = useCompanyStore();

  useEffect(() => {
    fetchCompany();

    return () => {
      clearCompany();
    };
  }, [fetchCompany, clearCompany]);

  const handleSubmit = async (
    payload: CompanyPayload
  ) => {
    try {
      await updateCompany(payload);
    } catch {
      // El error ya se maneja en el store.
    }
  };

  if (loading && !company) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-20 left-20 h-48 w-48 rounded-full bg-brand-300/10 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
            Empresa
          </span>

          <h1 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white/90 md:text-3xl">
            Información de la empresa
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            Administra la presentación, estadísticas y datos principales que
            se mostrarán en la landing de DreamsPlanetXP.
          </p>
        </div>
      </div>

      {company ? (
        <CompanyForm
          initialData={company}
          loading={updating}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No se pudo cargar la información de la empresa.
          </p>
        </div>
      )}
    </div>
  );
}