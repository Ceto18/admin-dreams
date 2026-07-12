// src/modules/people/components/form/PersonMissionsSection.tsx

"use client";

import Label from "@/shared/components/form/Label";
import type { Mission } from "@/modules/missions/types";
import type { PersonMissionPayload } from "../../types";
import { ROLE_OPTIONS } from "./personFormUtils";

type Props = {
  formMissions: PersonMissionPayload[];
  missions: Mission[];
  loadingMissions?: boolean;
  onAddMission: () => void;
  onRemoveMission: (index: number) => void;
  onMissionChange: (
    index: number,
    field: keyof PersonMissionPayload,
    value: string
  ) => void;
};

export default function PersonMissionsSection({
  formMissions,
  missions,
  loadingMissions = false,
  onAddMission,
  onRemoveMission,
  onMissionChange,
}: Props) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Misiones
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Selecciona una o más misiones y define el rol de la persona.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddMission}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/[0.1] dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/[0.05]"
        >
          Agregar misión
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {formMissions.map((mission, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 p-4 dark:border-white/[0.08] md:grid-cols-[1fr_1fr_auto]"
          >
            <div>
              <Label>Misión</Label>

              <select
                value={mission.mission_uuid}
                onChange={(event) =>
                  onMissionChange(index, "mission_uuid", event.target.value)
                }
                disabled={loadingMissions}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none focus:border-brand-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="">
                  {loadingMissions
                    ? "Cargando misiones..."
                    : "Selecciona una misión"}
                </option>

                {missions.map((item) => (
                  <option key={item.uuid} value={item.uuid}>
                    {item.name || item.label || item.uuid}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Rol</Label>

              <select
                value={mission.role}
                onChange={(event) =>
                  onMissionChange(index, "role", event.target.value)
                }
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="">Selecciona un rol</option>

                {ROLE_OPTIONS.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => onRemoveMission(index)}
                className="h-11 rounded-lg border border-error-200 bg-error-50 px-4 text-sm font-medium text-error-600 hover:bg-error-100 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}