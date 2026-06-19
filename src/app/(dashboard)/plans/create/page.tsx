"use client";

import { useRouter } from "next/navigation";
import { Spin } from "antd";

import PlanForm from "@/modules/plans/components/form/PlanForm";
import { usePlanStore } from "@/modules/plans/store/usePlanStore";
import { PlanPayload } from "@/modules/plans/types";

function PlanCreateSavingOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/75 dark:bg-gray-950/70">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
        <Spin size="large" />

        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Guardando plan...
        </p>
      </div>
    </div>
  );
}

export default function CreatePlanPage() {
  const router = useRouter();

  const { loading, createPlan } = usePlanStore();

  const handleSubmit = async (payload: PlanPayload) => {
    try {
      await createPlan(payload);

      router.push("/plans");
    } catch (error) {
      console.error("Error al crear plan:", error);
    }
  };

  const handleCancel = () => {
    router.push("/plans");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Nuevo plan
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Crea un plan y define sus límites de uso.
        </p>
      </div>

      <div className="relative">
        {loading && <PlanCreateSavingOverlay />}

        <PlanForm
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}