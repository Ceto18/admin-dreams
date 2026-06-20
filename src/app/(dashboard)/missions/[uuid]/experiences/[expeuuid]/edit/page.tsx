"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spin } from "antd";

import MissionExperienceForm from "@/modules/missions/mission-experiences/components/form/MissionExperienceForm";

import { useMissionExperienceStore } from "@/modules/missions/mission-experiences/store/useMissionExperienceStore";
import { MissionExperiencePayload } from "@/modules/missions/mission-experiences/types";

export default function EditMissionExperiencePage() {
  const router = useRouter();
  const params = useParams();

  const missionUuid = String(params.uuid ?? "");
  const expeuuid = String(params.expeuuid ?? "");

  const [imageDeletingUuid, setImageDeletingUuid] = useState<string | null>(
    null
  );

  const {
    experience,
    loading,
    fetchMissionExperience,
    updateMissionExperience,
    deleteMissionExperienceImage,
    clearExperience,
  } = useMissionExperienceStore();

  useEffect(() => {
    if (!missionUuid || !expeuuid) return;

    fetchMissionExperience(missionUuid, expeuuid);

    return () => {
      clearExperience();
    };
  }, [missionUuid, expeuuid, fetchMissionExperience, clearExperience]);

  const handleSubmit = async (payload: MissionExperiencePayload) => {
    try {
      await updateMissionExperience(missionUuid, expeuuid, payload);

      router.push(`/missions/${missionUuid}/experiences`);
    } catch {
      // El error ya se maneja en el store.
    }
  };

  const handleDeleteCurrentImage = async (imageUuid: string) => {
    try {
      setImageDeletingUuid(imageUuid);

      await deleteMissionExperienceImage(missionUuid, expeuuid, imageUuid);
    } catch {
      // El error ya se maneja en el store.
    } finally {
      setImageDeletingUuid(null);
    }
  };

  const handleBack = () => {
    router.push(`/missions/${missionUuid}/experiences`);
  };

  if (loading && !experience) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col items-center gap-3">
          <Spin size="large" />

          <span className="text-sm text-gray-500 dark:text-gray-400">
            Cargando experiencia...
          </span>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <button
            type="button"
            onClick={handleBack}
            className="mb-5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          >
            Volver a experiencias
          </button>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            No se encontró la experiencia.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <button
          type="button"
          onClick={handleBack}
          className="mb-5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
        >
          Volver a experiencias
        </button>

        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Editar experiencia
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Actualiza la información de la experiencia seleccionada.
        </p>
      </div>

      <MissionExperienceForm
        initialData={experience}
        loading={loading}
        imageDeletingUuid={imageDeletingUuid}
        onDeleteCurrentImage={handleDeleteCurrentImage}
        onSubmit={handleSubmit}
      />
    </div>
  );
}