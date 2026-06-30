"use client";

import { MissionFormState } from "./MissionForm";

interface Props {
    form: MissionFormState;
    onChange: (
        field: keyof MissionFormState,
        value: string | boolean
    ) => void;
}

export default function MissionInfoSection({ form, onChange }: Props) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Información de la misión
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Completa los datos principales de la misión.
                </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nombre
                    </label>

                    <input
                        type="text"
                        value={form.name}
                        onChange={(event) =>
                            onChange("name", event.target.value)
                        }
                        placeholder="Ej: Misión Marruecos 13"
                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Etiqueta
                    </label>

                    <input
                        type="text"
                        value={form.label}
                        onChange={(event) =>
                            onChange("label", event.target.value)
                        }
                        placeholder="Ej: Desierto mágico"
                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        País
                    </label>

                    <input
                        type="text"
                        value={form.country}
                        onChange={(event) =>
                            onChange("country", event.target.value)
                        }
                        placeholder="Ej: Marruecos"
                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                    />
                </div>
            </div>
        </div>
    );
}