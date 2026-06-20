"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

import TableToolbar from "@/shared/components/table/TableToolbar";
import TablePagination from "@/shared/components/table/TablePagination";
import ConfirmModal from "@/shared/components/ui/modal/ConfirmModal";

import MissionForm from "@/modules/missions/components/form/MissionForm";
import MissionTable from "@/modules/missions/components/MissionTable";

import { useMissionStore } from "@/modules/missions/store/useMissionStore";
import { Mission, MissionPayload } from "@/modules/missions/types";

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
    createMission,
    updateMission,
    deleteMission,
    toggleMissionState,
  } = useMissionStore();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [missionToDelete, setMissionToDelete] = useState<Mission | null>(null);

  useEffect(() => {
    fetchMissions({
      page: 1,
      perPage,
      search: "",
    });
  }, [fetchMissions, perPage]);

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
    setSelectedMission(null);
    setShowForm(true);
  };

  const handleOpenEdit = (mission: Mission) => {
    setSelectedMission(mission);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    if (loading) return;

    setSelectedMission(null);
    setShowForm(false);
  };

  const handleSubmit = async (payload: MissionPayload) => {
    try {
      if (selectedMission) {
        await updateMission(selectedMission.uuid, payload);
      } else {
        await createMission(payload);
      }

      await fetchMissions({
        page: currentPage,
        perPage,
        search,
      });

      setSelectedMission(null);
      setShowForm(false);
    } catch {
      // El error ya se maneja en el store.
    }
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

      {showForm && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-gray-900/60 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                  {selectedMission ? "Editar misión" : "Crear misión"}
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedMission
                    ? "Actualiza la información de la misión seleccionada."
                    : "Completa la información para registrar una nueva misión."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseForm}
                disabled={loading}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
              >
                Cerrar
              </button>
            </div>

            <MissionForm
              initialData={selectedMission}
              loading={loading}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(missionToDelete)}
        title="Eliminar misión"
        message={`¿Seguro que deseas eliminar la misión "${
          missionToDelete?.name ?? ""
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