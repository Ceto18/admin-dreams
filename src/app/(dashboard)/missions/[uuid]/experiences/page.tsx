"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spin } from "antd";

import TableToolbar from "@/shared/components/table/TableToolbar";
import TablePagination from "@/shared/components/table/TablePagination";
import ConfirmModal from "@/shared/components/ui/modal/ConfirmModal";

import MissionExperienceTable from "@/modules/missions/mission-experiences/components/MissionExperienceTable";

import { useMissionExperienceStore } from "@/modules/missions/mission-experiences/store/useMissionExperienceStore";
import { MissionExperience } from "@/modules/missions/mission-experiences/types";

function TableAntLoading() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/70 dark:bg-gray-950/70">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
        <Spin size="large" />

        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Cargando experiencias...
        </span>
      </div>
    </div>
  );
}

export default function MissionExperiencesPage() {
  const router = useRouter();
  const params = useParams();

  const missionUuid = String(params.uuid ?? "");

  const {
    experiences,
    loading,
    currentPage,
    totalPages,
    perPage,
    fetchMissionExperiences,
    deleteMissionExperience,
    updateMissionExperienceState,
  } = useMissionExperienceStore();

  const [search, setSearch] = useState("");
  const [experienceToDelete, setExperienceToDelete] =
    useState<MissionExperience | null>(null);

  useEffect(() => {
    if (!missionUuid) return;

    fetchMissionExperiences({
      missionUuid,
      page: 1,
      perPage,
      search: "",
    });
  }, [missionUuid, fetchMissionExperiences, perPage]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    if (!missionUuid) return;

    fetchMissionExperiences({
      missionUuid,
      page: 1,
      perPage,
      search,
    });
  };

  const handlePageChange = (page: number) => {
    if (!missionUuid) return;

    fetchMissionExperiences({
      missionUuid,
      page,
      perPage,
      search,
    });
  };

  const handlePerPageChange = (newPerPage: number) => {
    if (!missionUuid) return;

    fetchMissionExperiences({
      missionUuid,
      page: 1,
      perPage: newPerPage,
      search,
    });
  };

  const handleCreate = () => {
    router.push(`/missions/${missionUuid}/experiences/create`);
  };

  const handleView = (experience: MissionExperience) => {
    router.push(`/missions/${missionUuid}/experiences/${experience.uuid}`);
  };

  const handleEdit = (experience: MissionExperience) => {
    router.push(`/missions/${missionUuid}/experiences/${experience.uuid}/edit`);
  };

  const handleDelete = (experience: MissionExperience) => {
    setExperienceToDelete(experience);
  };

  const handleChangeState = async (
    experience: MissionExperience,
    state: boolean
  ) => {
    if (!missionUuid || !experience.uuid) return;

    try {
      await updateMissionExperienceState(missionUuid, experience.uuid, state);
    } catch {
      // El error ya se maneja en el store.
    }
  };

  const handleConfirmDelete = async () => {
    if (!experienceToDelete || !missionUuid) return;

    try {
      await deleteMissionExperience(missionUuid, experienceToDelete.uuid);

      setExperienceToDelete(null);

      await fetchMissionExperiences({
        missionUuid,
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

    setExperienceToDelete(null);
  };

  return (
    <div className="space-y-6">
      <TableToolbar
        title="Experiencias"
        description="Administra las experiencias registradas para esta misión."
        addLabel="Nueva experiencia"
        onAdd={handleCreate}
        searchValue={search}
        searchPlaceholder="Buscar experiencia..."
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />

      <button
        type="button"
        onClick={() => router.push("/missions")}
        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
      >
        Volver a misiones
      </button>

      <div className="relative">
        {loading && <TableAntLoading />}

        <MissionExperienceTable
          data={experiences}
          loading={false}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onChangeState={handleChangeState}
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
        open={Boolean(experienceToDelete)}
        title="Eliminar experiencia"
        message={`¿Seguro que deseas eliminar la experiencia "${
          experienceToDelete?.name ?? ""
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