"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Spin } from "antd";

import DiscountCodeForm from "@/modules/discountCodes/components/form/DiscountCodeForm";
import { useDiscountCodeStore } from "@/modules/discountCodes/store/useDiscountCodeStore";
import { DiscountCodePayload } from "@/modules/discountCodes/types";

function DiscountCodeEditInitialLoading() {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col items-center gap-4">
        <Spin size="large" />

        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Cargando código...
        </p>
      </div>
    </div>
  );
}

function DiscountCodeEditSavingOverlay() {
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

function DiscountCodeEditWarningMessage({ message }: { message: string }) {
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

export default function EditDiscountCodePage() {
  const router = useRouter();
  const params = useParams();

  const uuid = String(params.uuid ?? "");

  const {
    discountCode,
    loading,
    fetchDiscountCode,
    updateDiscountCode,
    clearDiscountCode,
  } = useDiscountCodeStore();

  useEffect(() => {
    if (uuid) {
      fetchDiscountCode(uuid);
    }

    return () => {
      clearDiscountCode();
    };
  }, [uuid, fetchDiscountCode, clearDiscountCode]);

  const handleSubmit = async (payload: DiscountCodePayload) => {
    try {
      if (!uuid) {
        throw new Error("No se encontró el UUID del código.");
      }

      await updateDiscountCode(uuid, payload);

      router.push("/discount-codes");
    } catch (error) {
      console.error("Error al actualizar código de descuento:", error);
    }
  };

  const handleCancel = () => {
    router.push("/discount-codes");
  };

  if (loading && !discountCode) {
    return <DiscountCodeEditInitialLoading />;
  }

  if (!loading && !discountCode) {
    return (
      <DiscountCodeEditWarningMessage message="No se encontró el código solicitado." />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Editar código de descuento
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Actualiza los datos y condiciones del código promocional.
        </p>
      </div>

      <div className="relative">
        {loading && <DiscountCodeEditSavingOverlay />}

        <DiscountCodeForm
          initialData={discountCode}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}