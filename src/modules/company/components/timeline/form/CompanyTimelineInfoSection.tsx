// src/modules/company/components/form/CompanyTimelineInfoSection.tsx

"use client";

import type { Instance } from "flatpickr/dist/types/instance";

import Input from "@/shared/components/form/input/InputField";
import TextArea from "@/shared/components/form/input/TextArea";
import DatePicker from "@/shared/components/form/date-picker";

import type {
    CompanyTimelineField,
    CompanyTimelineFormState,
} from "./types";

interface Props {
    form: CompanyTimelineFormState;
    fields: CompanyTimelineField[];
    loading?: boolean;

    onChange: (
        field: keyof CompanyTimelineFormState,
        value: string
    ) => void;
}

export default function CompanyTimelineInfoSection({
    form,
    fields,
    loading = false,
    onChange,
}: Props) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Información del acontecimiento
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Completa la información principal que aparecerá en la línea de
                    tiempo de la empresa.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {fields.map((field) => {
                    const value = form[field.name];

                    if (field.type === "textarea") {
                        return (
                            <div
                                key={field.name}
                                className={field.fullWidth ? "md:col-span-2" : ""}
                            >
                                <TextArea
                                    label={field.label}
                                    placeholder={field.placeholder}
                                    rows={field.rows ?? 6}
                                    value={value}
                                    disabled={loading}
                                    onChange={(newValue) =>
                                        onChange(field.name, newValue)
                                    }
                                />

                                {field.maxLength && (
                                    <p className="mt-1 text-right text-xs text-gray-400">
                                        {value.length}/{field.maxLength}
                                    </p>
                                )}
                            </div>
                        );
                    }

                    if (field.type === "date") {
                        return (
                            <div
                                key={`${field.name}-${value}`}
                                className={field.fullWidth ? "md:col-span-2" : ""}
                            >
                                <DatePicker
                                    id={field.name}
                                    label={field.label}
                                    placeholder={field.placeholder}
                                    defaultDate={value || undefined}
                                    onChange={(
                                        selectedDates: Date[],
                                        dateString: string,
                                        instance: Instance
                                    ) => {
                                        void selectedDates;
                                        void instance;

                                        onChange(field.name, dateString);
                                    }}
                                />
                            </div>
                        );
                    }

                    return (
                        <div
                            key={field.name}
                            className={field.fullWidth ? "md:col-span-2" : ""}
                        >
                            <Input
                                id={field.name}
                                name={field.name}
                                type={field.type ?? "text"}
                                label={field.label}
                                placeholder={field.placeholder}
                                value={value}
                                disabled={loading}
                                min={field.min}
                                max={field.max}
                                step={field.step}
                                onValueChange={(newValue) =>
                                    onChange(field.name, newValue)
                                }
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}