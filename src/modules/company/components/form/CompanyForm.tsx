// src/modules/company/components/form/CompanyForm.tsx

"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";

import Button from "@/shared/components/ui/button/Button";
import Input from "@/shared/components/form/input/InputField";
import TextArea from "@/shared/components/form/input/TextArea";

import type {
    Company,
    CompanyPayload,
} from "../../types";

interface Props {
    initialData?: Company | null;
    loading?: boolean;

    onSubmit: (
        payload: CompanyPayload
    ) => Promise<void> | void;
}

interface CompanyFormState {
    subtitle: string;
    info: string;
    satisfied_travelers: string;
    destinations_explored: string;
    average_rating: string;
    years_of_experience: string;
}

type CompanyFormField =
    | {
        name: Exclude<keyof CompanyFormState, "info">;
        label: string;
        type: "text" | "number";
        placeholder?: string;
        min?: string;
        max?: string;
        step?: string | number;
        fullWidth?: boolean;
    }
    | {
        name: "info";
        label: string;
        type: "textarea";
        placeholder?: string;
        rows?: number;
        fullWidth?: boolean;
    };

const initialState: CompanyFormState = {
    subtitle: "",
    info: "",
    satisfied_travelers: "",
    destinations_explored: "",
    average_rating: "",
    years_of_experience: "",
};

const companyFields: CompanyFormField[] = [
    {
        name: "subtitle",
        label: "Subtítulo",
        type: "text",
        placeholder: "Ej: Viajes diseñados para convertirse en recuerdos.",
        fullWidth: true,
    },
    {
        name: "satisfied_travelers",
        label: "Viajeros satisfechos",
        type: "number",
        placeholder: "Ej: 1500",
        min: "0",
    },
    {
        name: "destinations_explored",
        label: "Destinos explorados",
        type: "number",
        placeholder: "Ej: 35",
        min: "0",
    },
    {
        name: "average_rating",
        label: "Calificación promedio",
        type: "number",
        placeholder: "Ej: 4.8",
        min: "0",
        max: "5",
        step: "0.1",
    },
    {
        name: "years_of_experience",
        label: "Años de experiencia",
        type: "number",
        placeholder: "Ej: 12",
        min: "0",
    },
    {
        name: "info",
        label: "Información de la empresa",
        type: "textarea",
        placeholder:
            "Describe quiénes son, qué hacen y cuál es el propósito de la empresa...",
        rows: 10,
        fullWidth: true,
    },
];

export default function CompanyForm({
    initialData = null,
    loading = false,
    onSubmit,
}: Props) {
    const [form, setForm] =
        useState<CompanyFormState>(initialState);

    useEffect(() => {
        if (!initialData) {
            setForm(initialState);
            return;
        }

        setForm({
            subtitle: initialData.subtitle ?? "",
            info: initialData.info ?? "",
            satisfied_travelers: String(
                initialData.satisfied_travelers ?? ""
            ),
            destinations_explored: String(
                initialData.destinations_explored ?? ""
            ),
            average_rating: String(
                initialData.average_rating ?? ""
            ),
            years_of_experience: String(
                initialData.years_of_experience ?? ""
            ),
        });
    }, [initialData]);

    const handleChange = (
        field: keyof CompanyFormState,
        value: string
    ) => {
        setForm((previousForm) => ({
            ...previousForm,
            [field]: value,
        }));
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!form.subtitle.trim()) return;
        if (!form.info.trim()) return;

        const satisfiedTravelers = Number(
            form.satisfied_travelers
        );

        const destinationsExplored = Number(
            form.destinations_explored
        );

        const averageRating = Number(
            form.average_rating
        );

        const yearsOfExperience = Number(
            form.years_of_experience
        );

        if (
            Number.isNaN(satisfiedTravelers) ||
            satisfiedTravelers < 0
        ) {
            return;
        }

        if (
            Number.isNaN(destinationsExplored) ||
            destinationsExplored < 0
        ) {
            return;
        }

        if (
            Number.isNaN(averageRating) ||
            averageRating < 0 ||
            averageRating > 5
        ) {
            return;
        }

        if (
            Number.isNaN(yearsOfExperience) ||
            yearsOfExperience < 0
        ) {
            return;
        }

        await onSubmit({
            subtitle: form.subtitle.trim(),
            info: form.info.trim(),
            satisfied_travelers: satisfiedTravelers,
            destinations_explored: destinationsExplored,
            average_rating: averageRating,
            years_of_experience: yearsOfExperience,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Presentación de la empresa
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Administra el contenido principal y las estadísticas que se
                        mostrarán en la landing.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {companyFields.map((field) => {
                        const value = form[field.name];

                        if (field.type === "textarea") {
                            return (
                                <div
                                    key={field.name}
                                    className={
                                        field.fullWidth
                                            ? "md:col-span-2"
                                            : ""
                                    }
                                >
                                    <TextArea
                                        label={field.label}
                                        placeholder={field.placeholder}
                                        rows={field.rows ?? 6}
                                        value={value}
                                        disabled={loading}
                                        onChange={(newValue) =>
                                            handleChange(
                                                field.name,
                                                newValue
                                            )
                                        }
                                    />

                                    <p className="mt-1 text-right text-xs text-gray-400">
                                        {value.length}/5000
                                    </p>
                                </div>
                            );
                        }

                        return (
                            <div
                                key={field.name}
                                className={
                                    field.fullWidth
                                        ? "md:col-span-2"
                                        : ""
                                }
                            >
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    label={field.label}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={value}
                                    min={field.min}
                                    max={field.max}
                                    step={field.step}
                                    disabled={loading}
                                    onValueChange={(newValue) =>
                                        handleChange(
                                            field.name,
                                            newValue
                                        )
                                    }
                                />
                            </div>
                        );
                    })}
                </div>
            </section>

            <div className="flex justify-end gap-3">
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Guardando..."
                        : "Guardar cambios"}
                </Button>
            </div>
        </form>
    );
}