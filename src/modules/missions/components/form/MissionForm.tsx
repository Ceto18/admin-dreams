"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { Mission, MissionPayload } from "../../types";

import MissionInfoSection from "./MissionInfoSection";
import MissionFeaturedHomeSection from "./MissionFeaturedHomeSection";
import MissionImageSection from "./MissionImageSection";

interface Props {
    initialData?: Mission | null;
    loading?: boolean;
    onSubmit: (payload: MissionPayload) => Promise<void> | void;
}

export type MissionFormState = {
    name: string;
    label: string;
    country: string;
    featured_on_home: boolean;
    home_order: string;
};

const initialState: MissionFormState = {
    name: "",
    label: "",
    country: "",
    featured_on_home: false,
    home_order: "",
};

export default function MissionForm({
    initialData = null,
    loading = false,
    onSubmit,
}: Props) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [form, setForm] = useState<MissionFormState>(initialState);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");

    const currentImage = useMemo(() => {
        if (!initialData) return "";

        if (typeof initialData.image === "string") {
            return initialData.image;
        }

        if (initialData.image?.image_url) {
            return initialData.image.image_url;
        }

        if (initialData.image_url) {
            return initialData.image_url;
        }

        return "";
    }, [initialData]);

    useEffect(() => {
        if (!initialData) {
            setForm(initialState);
            clearSelectedImage();
            return;
        }

        setForm({
            name: initialData.name ?? "",
            label: initialData.label ?? "",
            country: initialData.country ?? "",
            featured_on_home: Boolean(
                Number(initialData.featured_on_home ?? 0)
            ),
            home_order:
                initialData.home_order !== null &&
                initialData.home_order !== undefined
                    ? String(initialData.home_order)
                    : "",
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
        field: keyof MissionFormState,
        value: string | boolean
    ) => {
        setForm((prev) => {
            if (field === "featured_on_home" && value === false) {
                return {
                    ...prev,
                    featured_on_home: false,
                    home_order: "",
                };
            }

            return {
                ...prev,
                [field]: value,
            };
        });
    };

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0] ?? null;

        if (!file) return;

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveSelectedImage = () => {
        clearSelectedImage();
    };

    function clearSelectedImage() {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImageFile(null);
        setImagePreview("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await onSubmit({
            name: form.name,
            label: form.label,
            country: form.country,
            featured_on_home: form.featured_on_home ? 1 : 0,
            home_order: form.featured_on_home
                ? Number(form.home_order)
                : null,
            image: imageFile,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <MissionInfoSection form={form} onChange={handleChange} />

            <MissionFeaturedHomeSection
                form={form}
                onChange={handleChange}
            />

            <MissionImageSection
                currentImage={currentImage}
                imageFile={imageFile}
                imagePreview={imagePreview}
                fileInputRef={fileInputRef}
                onImageChange={handleImageChange}
                onRemoveSelectedImage={handleRemoveSelectedImage}
            />

            <div className="flex justify-end gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading
                        ? "Guardando..."
                        : initialData
                          ? "Actualizar misión"
                          : "Crear misión"}
                </button>
            </div>
        </form>
    );
}