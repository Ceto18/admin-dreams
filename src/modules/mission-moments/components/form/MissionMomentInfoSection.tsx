"use client";

import { MomentField, MissionMomentFormState } from "./types";

interface Props {
  form: MissionMomentFormState;
  fields: MomentField[];
  onChange: (field: keyof MissionMomentFormState, value: string) => void;
}

export default function MissionMomentInfoSection({
  form,
  fields,
  onChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Información del momento
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Completa los datos principales del momento asociado a la experiencia.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {fields.map((field) => {
          const isTextarea =
            field.name === "description" || field.name === "proverb";

          return (
            <div
              key={field.name}
              className={isTextarea ? "md:col-span-2" : ""}
            >
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {field.label}
              </label>

              {isTextarea ? (
                <textarea
                  value={form[field.name]}
                  placeholder={field.placeholder}
                  onChange={(event) =>
                    onChange(field.name, event.target.value)
                  }
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              ) : (
                <input
                  type={field.type ?? "text"}
                  value={form[field.name]}
                  placeholder={field.placeholder}
                  onChange={(event) =>
                    onChange(field.name, event.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}