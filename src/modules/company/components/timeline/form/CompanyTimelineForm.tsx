// src/modules/company-timeline/components/form/CompanyTimelineForm.tsx

"use client";

import {
    FormEvent,
    useEffect,
    useRef,
    useState,
} from "react";

import Button from "@/shared/components/ui/button/Button";

import type {
    CompanyTimeline,
    CompanyTimelinePayload,
} from "../../../types";

import CompanyTimelineInfoSection from "./CompanyTimelineInfoSection";
import CompanyTimelineImageSection from "./CompanyTimelineImageSection";

import type {
    CompanyTimelineField,
    CompanyTimelineFormState,
} from "./types";

interface Props {
    initialData?: CompanyTimeline | null;
    loading?: boolean;

    onSubmit: (
        payload: CompanyTimelinePayload
    ) => Promise<void> | void;
}

const initialState: CompanyTimelineFormState = {
    title: "",
    description: "",
    event_date: "",
};

const timelineFields: CompanyTimelineField[] = [
    {
        name: "title",
        label: "Título",
        type: "text",
        placeholder: "Ej: Fundación de DreamsPlanetXP",
        maxLength: 255,
        fullWidth: true,
    },
    {
        name: "event_date",
        label: "Fecha del acontecimiento",
        type: "date",
        placeholder: "Selecciona una fecha",
    },
    {
        name: "description",
        label: "Descripción",
        type: "textarea",
        placeholder: "Describe lo ocurrido durante esta etapa...",
        maxLength: 2000,
        rows: 6,
        fullWidth: true,
    },
];

export default function CompanyTimelineForm({
    initialData = null,
    loading = false,
    onSubmit,
}: Props) {
    const fileInputRef =
        useRef<HTMLInputElement | null>(null);

    const [form, setForm] =
        useState<CompanyTimelineFormState>(initialState);

    const [imageFile, setImageFile] =
        useState<File | null>(null);

    const [imagePreview, setImagePreview] =
        useState<string | null>(null);

    const clearSelectedImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImageFile(null);
        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    useEffect(() => {
        if (!initialData) {
            setForm(initialState);
            clearSelectedImage();
            return;
        }

        setForm({
            title: initialData.title ?? "",
            description: initialData.description ?? "",
            event_date: normalizeDateForInput(
                initialData.event_date
            ),
        });

        clearSelectedImage();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleChange = (
        field: keyof CompanyTimelineFormState,
        value: string
    ) => {
        setForm((previousForm) => ({
            ...previousForm,
            [field]: value,
        }));
    };

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile =
            event.target.files?.[0] ?? null;

        if (!selectedFile) return;

        if (!selectedFile.type.startsWith("image/")) {
            event.target.value = "";
            return;
        }

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImageFile(selectedFile);
        setImagePreview(
            URL.createObjectURL(selectedFile)
        );
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!form.title.trim()) return;
        if (!form.description.trim()) return;
        if (!form.event_date) return;

        if (!initialData && !imageFile) {
            return;
        }

        await onSubmit({
            title: form.title.trim(),
            description: form.description.trim(),
            event_date: form.event_date,
            image: imageFile,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <CompanyTimelineInfoSection
                form={form}
                fields={timelineFields}
                onChange={handleChange}
            />

            <CompanyTimelineImageSection
                currentImageUrl={initialData?.image_url}
                imagePreview={imagePreview}
                fileInputRef={fileInputRef}
                loading={loading}
                onImageChange={handleImageChange}
                onRemoveSelectedImage={clearSelectedImage}
            />

            <div className="flex justify-end gap-3">
                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Guardando..."
                        : initialData
                            ? "Actualizar acontecimiento"
                            : "Crear acontecimiento"}
                </Button>
            </div>
        </form>
    );
}

function normalizeDateForInput(
    date?: string | null
): string {
    if (!date) return "";

    return date.slice(0, 10);
}