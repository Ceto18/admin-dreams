"use client";

import { useParams, useRouter } from "next/navigation";

import MissionExperienceForm from "@/modules/missions/mission-experiences/components/form/MissionExperienceForm";

import { useMissionExperienceStore } from "@/modules/missions/mission-experiences/store/useMissionExperienceStore";
import { MissionExperiencePayload } from "@/modules/missions/mission-experiences/types";

export default function CreateMissionExperiencePage() {
  const router = useRouter();
  const params = useParams();

  const missionUuid = String(params.uuid ?? "");

  const { loading, createMissionExperience } = useMissionExperienceStore();

  const handleSubmit = async (payload: MissionExperiencePayload) => {
    await createMissionExperience(missionUuid, payload);

    router.push(`/missions/${missionUuid}/experiences`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <button
          type="button"
          onClick={() => router.push(`/missions/${missionUuid}/experiences`)}
          className="mb-5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
        >
          Volver a experiencias
        </button>

        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Crear experiencia
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Completa la información para registrar una nueva experiencia.
        </p>
      </div>

      <MissionExperienceForm loading={loading} onSubmit={handleSubmit} />
    </div>
  );
}