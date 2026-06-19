// src/app/(admin)/plans/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

import TableToolbar from "@/shared/components/table/TableToolbar";
import TablePagination from "@/shared/components/table/TablePagination";
import ConfirmModal from "@/shared/components/ui/modal/ConfirmModal";

import PlanTable from "@/modules/plans/components/PlanTable";
import { usePlanStore } from "@/modules/plans/store/usePlanStore";
import { Plan } from "@/modules/plans/types";

function TableAntLoading() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/70 dark:bg-gray-950/70">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
        <Spin size="large" />

        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Cargando planes...
        </span>
      </div>
    </div>
  );
}

export default function PlansPage() {
  const router = useRouter();

  const {
    plans,
    currentPage,
    totalPages,
    perPage,
    loading,
    fetchPlans,
    togglePlanState,
    deletePlan,
  } = usePlanStore();

  const [search, setSearch] = useState("");
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

  useEffect(() => {
    fetchPlans({
      page: 1,
      perPage,
      search: "",
    });
  }, [fetchPlans, perPage]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    fetchPlans({
      page: 1,
      perPage,
      search,
    });
  };

  const handlePageChange = (page: number) => {
    fetchPlans({
      page,
      perPage,
      search,
    });
  };

  const handlePerPageChange = (newPerPage: number) => {
    fetchPlans({
      page: 1,
      perPage: newPerPage,
      search,
    });
  };

  const handleView = (plan: Plan) => {
    router.push(`/plans/${plan.uuid}`);
  };

  const handleEdit = (plan: Plan) => {
    router.push(`/plans/${plan.uuid}/edit`);
  };

  const handleDelete = (plan: Plan) => {
    setPlanToDelete(plan);
  };

  const handleToggleState = async (plan: Plan, state: boolean) => {
    try {
      await togglePlanState(plan.uuid, state);
    } catch {
      // El error ya se maneja en el store.
    }
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;

    try {
      await deletePlan(planToDelete.uuid);

      setPlanToDelete(null);

      await fetchPlans({
        page: currentPage,
        perPage,
        search,
      });
    } catch {
      // El error ya se maneja en el store.
    }
  };

  const handleCancelDelete = () => {
    if (loading) return;

    setPlanToDelete(null);
  };

  return (
    <div className="space-y-6">
      <TableToolbar
        title="Planes"
        description="Administra los planes disponibles para las organizaciones."
        addLabel="Nuevo plan"
        onAdd={() => router.push("/plans/create")}
        searchValue={search}
        searchPlaceholder="Buscar plan..."
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className="relative">
        {loading && <TableAntLoading />}

        <PlanTable
          data={plans}
          loading={false}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleState={handleToggleState}
        />
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        perPage={perPage}
        perPageOptions={[10, 25, 50, 100]}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />

      <ConfirmModal
        open={Boolean(planToDelete)}
        title="Eliminar plan"
        message={`¿Seguro que deseas eliminar el plan "${
          planToDelete?.name ?? ""
        }"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}