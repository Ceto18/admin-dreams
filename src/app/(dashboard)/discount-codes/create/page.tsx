"use client";

import { useRouter } from "next/navigation";
import { Spin } from "antd";

import DiscountCodeForm from "@/modules/discountCodes/components/form/DiscountCodeForm";
import { useDiscountCodeStore } from "@/modules/discountCodes/store/useDiscountCodeStore";
import { DiscountCodePayload } from "@/modules/discountCodes/types";

function DiscountCodeCreateSavingOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/75 dark:bg-gray-950/70">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
        <Spin size="large" />

        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Guardando código...
        </p>
      </div>
    </div>
  );
}

export default function CreateDiscountCodePage() {
  const router = useRouter();

  const { loading, createDiscountCode } = useDiscountCodeStore();

  const handleSubmit = async (payload: DiscountCodePayload) => {
    try {
      await createDiscountCode(payload);

      router.push("/discount-codes");
    } catch (error) {
      console.error("Error al crear código de descuento:", error);
    }
  };

  const handleCancel = () => {
    router.push("/discount-codes");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Nuevo código de descuento
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Crea un código promocional y define sus condiciones de uso.
        </p>
      </div>

      <div className="relative">
        {loading && <DiscountCodeCreateSavingOverlay />}

        <DiscountCodeForm
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}