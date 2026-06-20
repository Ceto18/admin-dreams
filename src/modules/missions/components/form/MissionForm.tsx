"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { Mission, MissionPayload } from "../../types";

interface Props {
    initialData?: Mission | null;
    loading?: boolean;
    onSubmit: (payload: MissionPayload) => Promise<void> | void;
}

type MissionFormState = {
    name: string;
    label: string;
    country: string;
    active: boolean;
};

const initialState: MissionFormState = {
    name: "",
    label: "",
    country: "",
    active: true,
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
            setImageFile(null);
            setImagePreview("");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            return;
        }

        setForm({
            name: initialData.name ?? "",
            label: initialData.label ?? "",
            country: initialData.country ?? "",
            active: Boolean(initialData.active),
        });

        setImageFile(null);
        setImagePreview("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
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
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
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
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImageFile(null);
        setImagePreview("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await onSubmit({
            name: form.name,
            label: form.label,
            country: form.country,
            active: form.active,
            image: imageFile,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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
                                handleChange("name", event.target.value)
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
                                handleChange("label", event.target.value)
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
                                handleChange("country", event.target.value)
                            }
                            placeholder="Ej: Marruecos"
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Estado
                        </label>

                        <button
                            type="button"
                            onClick={() =>
                                handleChange("active", !form.active)
                            }
                            className={`flex h-11 w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                                form.active
                                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400"
                                    : "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                            }`}
                        >
                            <span>{form.active ? "Activo" : "Inactivo"}</span>

                            <span
                                className={`h-5 w-10 rounded-full p-0.5 transition ${
                                    form.active
                                        ? "bg-green-500"
                                        : "bg-gray-300 dark:bg-gray-700"
                                }`}
                            >
                                <span
                                    className={`block h-4 w-4 rounded-full bg-white transition ${
                                        form.active
                                            ? "translate-x-5"
                                            : "translate-x-0"
                                    }`}
                                />
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Imagen de la misión
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Selecciona una imagen representativa para esta misión.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                            Imagen actual
                        </h3>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Esta es la imagen guardada actualmente.
                        </p>

                        {currentImage ? (
                            <div className="relative mt-4 h-64 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                                <Image
                                    src={currentImage}
                                    alt="Imagen actual de la misión"
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />

                                <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                                    Actual
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 flex h-64 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                                No hay imagen actual.
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                    Nueva imagen
                                </h3>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Puedes cargar una nueva imagen para crear o
                                    reemplazar.
                                </p>
                            </div>

                            {imageFile && (
                                <button
                                    type="button"
                                    onClick={handleRemoveSelectedImage}
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                                >
                                    Quitar
                                </button>
                            )}
                        </div>

                        {imagePreview ? (
                            <div className="relative mt-4 h-64 overflow-hidden rounded-2xl border border-brand-200 bg-brand-50 dark:border-brand-500/20 dark:bg-brand-500/10">
                                <Image
                                    src={imagePreview}
                                    alt="Vista previa de imagen"
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />

                                <div className="absolute left-3 top-3 rounded-full bg-brand-500 px-3 py-1 text-xs font-medium text-white">
                                    Nueva
                                </div>
                            </div>
                        ) : (
                            <label
                                htmlFor="mission-image"
                                className="mt-4 flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 text-center transition hover:border-brand-500 hover:bg-brand-50/40 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-500 dark:hover:bg-brand-500/10"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={1.8}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 5v14M5 12h14"
                                        />
                                    </svg>
                                </div>

                                <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Click para seleccionar imagen
                                </p>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    PNG, JPG, JPEG o WEBP
                                </p>
                            </label>
                        )}

                        <input
                            ref={fileInputRef}
                            id="mission-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        {imagePreview && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                            >
                                Cambiar imagen seleccionada
                            </button>
                        )}

                        {!imageFile && currentImage && (
                            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                Si no seleccionas una nueva imagen, se mantendrá
                                la imagen actual.
                            </p>
                        )}
                    </div>
                </div>
            </div>

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