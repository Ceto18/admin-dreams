"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

import TableToolbar from "@/shared/components/table/TableToolbar";
import TablePagination from "@/shared/components/table/TablePagination";
import ConfirmModal from "@/shared/components/ui/modal/ConfirmModal";

import MissionTable from "@/modules/missions/components/MissionTable";

import { useMissionStore } from "@/modules/missions/store/useMissionStore";
import { Mission } from "@/modules/missions/types";

function TableAntLoading() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/70 dark:bg-gray-950/70">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
        <Spin size="large" />

        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Cargando misiones...
        </span>
      </div>
    </div>
  );
}

export default function MissionsPage() {
  const router = useRouter();

  const {
    missions,
    loading,
    currentPage,
    totalPages,
    perPage,
    fetchMissions,
    deleteMission,
    toggleMissionState,
  } = useMissionStore();

  const [search, setSearch] = useState("");
  const [missionToDelete, setMissionToDelete] = useState<Mission | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchMissions({
        page: 1,
        perPage,
        search: search.trim(),
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, perPage, fetchMissions]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    fetchMissions({
      page: 1,
      perPage,
      search,
    });
  };

  const handlePageChange = (page: number) => {
    fetchMissions({
      page,
      perPage,
      search,
    });
  };

  const handlePerPageChange = (newPerPage: number) => {
    fetchMissions({
      page: 1,
      perPage: newPerPage,
      search,
    });
  };

  const handleView = (mission: Mission) => {
    router.push(`/missions/${mission.uuid}/experiences`);
  };

  const handleOpenCreate = () => {
    router.push("/missions/create");
  };

  const handleOpenEdit = (mission: Mission) => {
    router.push(`/missions/${mission.uuid}/edit`);
  };

  const handleDelete = (mission: Mission) => {
    setMissionToDelete(mission);
  };

  const handleConfirmDelete = async () => {
    if (!missionToDelete) return;

    try {
      await deleteMission(missionToDelete.uuid);

      setMissionToDelete(null);

      await fetchMissions({
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

    setMissionToDelete(null);
  };

  const handleToggleState = async (mission: Mission, state: boolean) => {
    try {
      await toggleMissionState(mission.uuid, state);
    } catch {
      // El error ya se maneja en el store.
    }
  };

  return (
    <div className="space-y-6">
      <TableToolbar
        title="Misiones"
        description="Administra las misiones visibles en la landing de Dreams."
        addLabel="Nueva misión"
        onAdd={handleOpenCreate}
        searchValue={search}
        searchPlaceholder="Buscar misión..."
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className="relative">
        {loading && <TableAntLoading />}

        <MissionTable
          data={missions}
          loading={false}
          onView={handleView}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onToggleState={handleToggleState}
          showView
          showEdit
          showDelete
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
        open={Boolean(missionToDelete)}
        title="Eliminar misión"
        message={`¿Seguro que deseas eliminar la misión "${missionToDelete?.name ?? ""
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