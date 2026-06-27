"use client";

import { useEffect, useMemo, useState } from "react";
import { Spin } from "antd";

import TableToolbar from "@/shared/components/table/TableToolbar";
import TablePagination from "@/shared/components/table/TablePagination";
import ConfirmModal from "@/shared/components/ui/modal/ConfirmModal";
import Select from "@/shared/components/form/Select";

import MissionMomentForm from "@/modules/mission-moments/components/form/MissionMomentForm";
import MissionMomentTable from "@/modules/mission-moments/components/MissionMomentTable";

import { useMissionStore } from "@/modules/missions/store/useMissionStore";
import { useMissionExperienceStore } from "@/modules/missions/mission-experiences/store/useMissionExperienceStore";
import { useMissionMomentStore } from "@/modules/mission-moments/store/missionMomentStore";

import {
  MissionMoment,
  MissionMomentPayload,
} from "@/modules/mission-moments/types";

import { MissionExperience } from "@/modules/missions/mission-experiences/types";

function TableAntLoading() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/70 dark:bg-gray-950/70">
      <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-white/[0.08] dark:bg-gray-900">
        <Spin size="large" />

        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Cargando momentos...
        </span>
      </div>
    </div>
  );
}

export default function MissionMomentsPage() {
  const {
    missions,
    loading: loadingMissions,
    perPage: missionPerPage,
    fetchMissions,
  } = useMissionStore();

  const {
    loading: loadingExperiences,
    fetchAllMissionExperiencesForSelect,
  } = useMissionExperienceStore();

  const {
    moments,
    loading,
    currentPage,
    totalPages,
    perPage,
    fetchMissionMoments,
    createMissionMoment,
    updateMissionMoment,
    deleteMissionMoment,
    deleteMissionMomentImage,
  } = useMissionMomentStore();

  const [search, setSearch] = useState("");
  const [missionUuid, setMissionUuid] = useState("");
  const [experienceUuid, setExperienceUuid] = useState("");

  const [experienceOptionsData, setExperienceOptionsData] = useState<
    MissionExperience[]
  >([]);

  const [showForm, setShowForm] = useState(false);
  const [selectedMoment, setSelectedMoment] = useState<MissionMoment | null>(
    null
  );
  const [momentToDelete, setMomentToDelete] = useState<MissionMoment | null>(
    null
  );

  const [imageToDeleteUuid, setImageToDeleteUuid] = useState<string | null>(
    null
  );
  const [imageDeletingUuid, setImageDeletingUuid] = useState<string | null>(
    null
  );

  const missionOptions = useMemo(
    () =>
      missions.map((mission) => ({
        value: mission.uuid,
        label: mission.name,
      })),
    [missions]
  );

  const experienceOptions = useMemo(
    () =>
      experienceOptionsData.map((experience) => ({
        value: experience.uuid,
        label: experience.name,
      })),
    [experienceOptionsData]
  );

  const canFetchMoments = Boolean(missionUuid && experienceUuid);

  useEffect(() => {
    fetchMissions({
      page: 1,
      perPage: missionPerPage,
      search: "",
    });
  }, [fetchMissions, missionPerPage]);

  useEffect(() => {
    if (!missionUuid) {
      setExperienceOptionsData([]);
      return;
    }

    const loadExperiences = async () => {
      const data = await fetchAllMissionExperiencesForSelect(missionUuid);
      setExperienceOptionsData(data);
    };

    loadExperiences();
  }, [missionUuid, fetchAllMissionExperiencesForSelect]);

  useEffect(() => {
    if (!canFetchMoments) return;

    fetchMissionMoments({
      missionUuid,
      experienceUuid,
      page: 1,
      perPage,
      search,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionUuid, experienceUuid, canFetchMoments, fetchMissionMoments, perPage]);

  const handleMissionChange = (value: string) => {
    setMissionUuid(value);
    setExperienceUuid("");
    setExperienceOptionsData([]);
    setSelectedMoment(null);
    setShowForm(false);
    setSearch("");
    setImageToDeleteUuid(null);
    setImageDeletingUuid(null);
  };

  const handleExperienceChange = (value: string) => {
    setExperienceUuid(value);
    setSelectedMoment(null);
    setShowForm(false);
    setImageToDeleteUuid(null);
    setImageDeletingUuid(null);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSearchSubmit = () => {
    if (!canFetchMoments) return;

    fetchMissionMoments({
      missionUuid,
      experienceUuid,
      page: 1,
      perPage,
      search,
    });
  };

  const handlePageChange = (page: number) => {
    if (!canFetchMoments) return;

    fetchMissionMoments({
      missionUuid,
      experienceUuid,
      page,
      perPage,
      search,
    });
  };

  const handlePerPageChange = (newPerPage: number) => {
    if (!canFetchMoments) return;

    fetchMissionMoments({
      missionUuid,
      experienceUuid,
      page: 1,
      perPage: newPerPage,
      search,
    });
  };

  const handleOpenCreate = () => {
    if (!missionUuid || !experienceUuid) {
      alert("Primero selecciona una misión y una experiencia.");
      return;
    }

    setSelectedMoment(null);
    setImageToDeleteUuid(null);
    setImageDeletingUuid(null);
    setShowForm(true);
  };

  const handleOpenEdit = (moment: MissionMoment) => {
    setSelectedMoment(moment);
    setImageToDeleteUuid(null);
    setImageDeletingUuid(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    if (loading || imageDeletingUuid) return;

    setSelectedMoment(null);
    setShowForm(false);
    setImageToDeleteUuid(null);
    setImageDeletingUuid(null);
  };

  const handleSubmit = async (payload: MissionMomentPayload) => {
    if (!missionUuid || !experienceUuid) {
      alert("Selecciona una misión y una experiencia.");
      return;
    }

    try {
      if (selectedMoment) {
        await updateMissionMoment(
          missionUuid,
          experienceUuid,
          selectedMoment.uuid,
          payload
        );
      } else {
        await createMissionMoment(missionUuid, experienceUuid, payload);
      }

      await fetchMissionMoments({
        missionUuid,
        experienceUuid,
        page: currentPage,
        perPage,
        search,
      });

      setSelectedMoment(null);
      setShowForm(false);
      setImageToDeleteUuid(null);
      setImageDeletingUuid(null);
    } catch {
      // El error ya se maneja en el store.
    }
  };

  const handleDelete = (moment: MissionMoment) => {
    setMomentToDelete(moment);
  };

  const handleConfirmDelete = async () => {
    if (!momentToDelete || !missionUuid || !experienceUuid) return;

    try {
      await deleteMissionMoment(
        missionUuid,
        experienceUuid,
        momentToDelete.uuid
      );

      setMomentToDelete(null);

      await fetchMissionMoments({
        missionUuid,
        experienceUuid,
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

    setMomentToDelete(null);
  };

  const handleDeleteCurrentImage = (imageUuid: string) => {
    setImageToDeleteUuid(imageUuid);
  };

  const handleConfirmDeleteImage = async () => {
    if (
      !imageToDeleteUuid ||
      !missionUuid ||
      !experienceUuid ||
      !selectedMoment
    ) {
      return;
    }

    try {
      setImageDeletingUuid(imageToDeleteUuid);

      await deleteMissionMomentImage(
        missionUuid,
        experienceUuid,
        selectedMoment.uuid,
        imageToDeleteUuid
      );

      setSelectedMoment((prev) =>
        prev
          ? {
              ...prev,
              images: prev.images?.filter(
                (image) => image.uuid !== imageToDeleteUuid
              ),
            }
          : prev
      );

      setImageToDeleteUuid(null);
    } catch {
      // El error ya se maneja en el store.
    } finally {
      setImageDeletingUuid(null);
    }
  };

  const handleCancelDeleteImage = () => {
    if (imageDeletingUuid) return;

    setImageToDeleteUuid(null);
  };

  const tableData = canFetchMoments ? moments : [];

  return (
    <div className="space-y-6">
      {!showForm && (
        <TableToolbar
          title="Momentos"
          description="Administra los momentos asociados a cada experiencia de una misión."
          addLabel="Nuevo momento"
          onAdd={handleOpenCreate}
          searchValue={search}
          searchPlaceholder="Buscar momento..."
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />
      )}

      {showForm ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {selectedMoment ? "Editar momento" : "Crear momento"}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {selectedMoment
                  ? "Actualiza la información del momento seleccionado."
                  : "Completa la información para registrar un nuevo momento."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCloseForm}
              disabled={loading || Boolean(imageDeletingUuid)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
            >
              Volver a la tabla
            </button>
          </div>

          <MissionMomentForm
            initialData={selectedMoment}
            loading={loading}
            imageDeletingUuid={imageDeletingUuid}
            onSubmit={handleSubmit}
            onDeleteCurrentImage={handleDeleteCurrentImage}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Misión
              </label>

              <Select
                key="mission-select"
                options={missionOptions}
                placeholder={
                  loadingMissions
                    ? "Cargando misiones..."
                    : "Selecciona una misión"
                }
                defaultValue={missionUuid}
                onChange={handleMissionChange}
                disabled={loadingMissions}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Experiencia
              </label>

              <Select
                key={`experience-select-${missionUuid}`}
                options={experienceOptions}
                placeholder={
                  !missionUuid
                    ? "Primero selecciona una misión"
                    : loadingExperiences
                      ? "Cargando experiencias..."
                      : experienceOptions.length === 0
                        ? "No hay experiencias disponibles"
                        : "Selecciona una experiencia"
                }
                defaultValue={experienceUuid}
                onChange={handleExperienceChange}
                disabled={
                  !missionUuid ||
                  loadingExperiences ||
                  experienceOptions.length === 0
                }
              />

              {!missionUuid && (
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Selecciona una misión para cargar sus experiencias.
                </p>
              )}
            </div>
          </div>

          <div className="relative">
            {loading && <TableAntLoading />}

            <MissionMomentTable
              data={tableData}
              loading={false}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              showEdit
              showDelete
            />
          </div>

          <TablePagination
            currentPage={canFetchMoments ? currentPage : 1}
            totalPages={canFetchMoments ? totalPages : 1}
            perPage={perPage}
            perPageOptions={[10, 25, 50, 100]}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        </>
      )}

      <ConfirmModal
        open={Boolean(momentToDelete)}
        title="Eliminar momento"
        message={`¿Seguro que deseas eliminar el momento "${
          momentToDelete?.title ?? ""
        }"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={loading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <ConfirmModal
        open={Boolean(imageToDeleteUuid)}
        title="Eliminar imagen"
        message="¿Seguro que deseas eliminar esta imagen? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={Boolean(imageDeletingUuid)}
        onConfirm={handleConfirmDeleteImage}
        onCancel={handleCancelDeleteImage}
      />
    </div>
  );
}