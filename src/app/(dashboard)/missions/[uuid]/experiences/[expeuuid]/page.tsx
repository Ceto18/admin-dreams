"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spin } from "antd";

import MissionExperienceDetail from "@/modules/missions/mission-experiences/components/MissionExperienceDetail";
import { useMissionExperienceStore } from "@/modules/missions/mission-experiences/store/useMissionExperienceStore";

export default function MissionExperienceDetailPage() {
  const router = useRouter();
  const params = useParams();

  const missionUuid = String(params.uuid ?? "");
  const expeuuid = String(params.expeuuid ?? "");

  const { experience, loading, fetchMissionExperience, clearExperience } =
    useMissionExperienceStore();

  useEffect(() => {
    if (!missionUuid || !expeuuid) return;

    fetchMissionExperience(missionUuid, expeuuid);

    return () => {
      clearExperience();
    };
  }, [missionUuid, expeuuid, fetchMissionExperience, clearExperience]);

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => router.push(`/missions/${missionUuid}/experiences`)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
        >
          Volver a experiencias
        </button>
      </div>

      {loading && !experience ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col items-center gap-3">
            <Spin size="large" />

            <span className="text-sm text-gray-500 dark:text-gray-400">
              Cargando experiencia...
            </span>
          </div>
        </div>
      ) : !experience ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No se encontró la experiencia.
          </p>
        </div>
      ) : (
        <MissionExperienceDetail experience={experience} />
      )}
    </div>
  );
}