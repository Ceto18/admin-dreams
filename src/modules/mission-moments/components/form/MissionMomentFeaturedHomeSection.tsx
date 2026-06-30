"use client";

import Label from "@/shared/components/form/Label";
import Select from "@/shared/components/form/Select";

import { MissionMomentFormState } from "./types";

interface Props {
  form: MissionMomentFormState;
  onChange: (
    field: keyof MissionMomentFormState,
    value: string | boolean
  ) => void;
}

const orderOptions = [
  { value: "1", label: "Orden 1" },
  { value: "2", label: "Orden 2" },
  { value: "3", label: "Orden 3" },
  { value: "4", label: "Orden 4" },
  { value: "5", label: "Orden 5" },
  { value: "6", label: "Orden 6" },
];

export default function MissionMomentFeaturedHomeSection({
  form,
  onChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Destacar en Home
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Activa este momento para mostrarlo en la página de inicio y define su
          orden de aparición.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <Label>Mostrar en home</Label>

          <button
            type="button"
            onClick={() =>
              onChange("featured_on_home", !form.featured_on_home)
            }
            className={`flex h-11 w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
              form.featured_on_home
                ? "border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-400"
                : "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            }`}
          >
            <span>
              {form.featured_on_home
                ? "Visible en home"
                : "No visible en home"}
            </span>

            <span
              className={`h-5 w-10 rounded-full p-0.5 transition ${
                form.featured_on_home
                  ? "bg-brand-500"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              <span
                className={`block h-4 w-4 rounded-full bg-white transition ${
                  form.featured_on_home
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </span>
          </button>

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Si está activo, este momento podrá aparecer en la landing principal.
          </p>
        </div>

        <div>
          <Label>Orden en home</Label>

          <Select
            options={orderOptions}
            placeholder={
              form.featured_on_home
                ? "Selecciona un orden"
                : "Activa mostrar en home"
            }
            value={form.home_order}
            onChange={(value) => onChange("home_order", value)}
            disabled={!form.featured_on_home}
          />

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Selecciona una posición del 1 al 6 para ordenar los momentos
            destacados en el home.
          </p>
        </div>
      </div>
    </div>
  );
}