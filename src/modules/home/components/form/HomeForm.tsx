"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { Home, HomePayload } from "../../types";

interface Props {
    initialData?: Home | null;
    loading?: boolean;
    onSubmit: (payload: HomePayload) => Promise<void> | void;
}

type HeroFormState = {
    title: string;
    highlight_text: string;
    description: string;
    destinations_count: string;
    travelers_count: string;
    experiences_count: string;
    continents_count: string;
};

const initialState: HeroFormState = {
    title: "",
    highlight_text: "",
    description: "",
    destinations_count: "",
    travelers_count: "",
    experiences_count: "",
    continents_count: "",
};

export default function HomeForm({
    initialData = null,
    loading = false,
    onSubmit,
}: Props) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [form, setForm] = useState<HeroFormState>(initialState);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
        null
    );
    const [replacementFiles, setReplacementFiles] = useState<
        Record<number, File>
    >({});
    const [replacementPreviews, setReplacementPreviews] = useState<
        Record<number, string>
    >({});

    const existingImages = useMemo(() => {
        return initialData?.hero?.images ?? [];
    }, [initialData]);

    useEffect(() => {
        if (!initialData?.hero) return;

        setForm({
            title: initialData.hero.title ?? "",
            highlight_text: initialData.hero.highlight_text ?? "",
            description: initialData.hero.description ?? "",
            destinations_count: String(
                initialData.hero.destinations_count ?? ""
            ),
            travelers_count: String(initialData.hero.travelers_count ?? ""),
            experiences_count: String(
                initialData.hero.experiences_count ?? ""
            ),
            continents_count: String(initialData.hero.continents_count ?? ""),
        });
    }, [initialData]);

    useEffect(() => {
        return () => {
            Object.values(replacementPreviews).forEach((url) =>
                URL.revokeObjectURL(url)
            );
        };
    }, [replacementPreviews]);

    const handleChange = (field: keyof HeroFormState, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSelectImage = (index: number) => {
        setSelectedImageIndex(index);
    };

    const handleOpenFileInput = () => {
        if (selectedImageIndex === null) return;

        fileInputRef.current?.click();
    };

    const handleReplacementImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (selectedImageIndex === null) return;

        const file = event.target.files?.[0];

        if (!file) return;

        setReplacementFiles((prev) => ({
            ...prev,
            [selectedImageIndex]: file,
        }));

        setReplacementPreviews((prev) => {
            const previousPreview = prev[selectedImageIndex];

            if (previousPreview) {
                URL.revokeObjectURL(previousPreview);
            }

            return {
                ...prev,
                [selectedImageIndex]: URL.createObjectURL(file),
            };
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemoveReplacement = (index: number) => {
        setReplacementFiles((prev) => {
            const next = { ...prev };
            delete next[index];

            return next;
        });

        setReplacementPreviews((prev) => {
            const preview = prev[index];

            if (preview) {
                URL.revokeObjectURL(preview);
            }

            const next = { ...prev };
            delete next[index];

            return next;
        });
    };

    const handleClearAllReplacements = () => {
        Object.values(replacementPreviews).forEach((url) =>
            URL.revokeObjectURL(url)
        );

        setReplacementFiles({});
        setReplacementPreviews({});
        setSelectedImageIndex(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const images: File[] = [];

        Object.entries(replacementFiles).forEach(([index, file]) => {
            images[Number(index)] = file;
        });

        await onSubmit({
            hero: {
                title: form.title,
                highlight_text: form.highlight_text,
                description: form.description,
                destinations_count: form.destinations_count,
                travelers_count: form.travelers_count,
                experiences_count: form.experiences_count,
                continents_count: form.continents_count,
                images,
            },
        });
    };

    const selectedImage =
        selectedImageIndex !== null
            ? existingImages[selectedImageIndex]
            : null;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Hero principal
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Actualiza el contenido principal que aparece en la
                        portada de Dreams.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Título
                        </label>

                        <input
                            type="text"
                            value={form.title}
                            onChange={(event) =>
                                handleChange("title", event.target.value)
                            }
                            placeholder="Ej: Vive experiencias únicas"
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Texto destacado
                        </label>

                        <input
                            type="text"
                            value={form.highlight_text}
                            onChange={(event) =>
                                handleChange(
                                    "highlight_text",
                                    event.target.value
                                )
                            }
                            placeholder="Ej: con Dreams"
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                        />
                    </div>

                    <div className="lg:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Descripción
                        </label>

                        <textarea
                            value={form.description}
                            onChange={(event) =>
                                handleChange(
                                    "description",
                                    event.target.value
                                )
                            }
                            placeholder="Describe la propuesta principal de Dreams"
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Contadores
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Estos valores se mostrarán como indicadores en el hero.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Destinos
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={form.destinations_count}
                            onChange={(event) =>
                                handleChange(
                                    "destinations_count",
                                    event.target.value
                                )
                            }
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Viajeros
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={form.travelers_count}
                            onChange={(event) =>
                                handleChange(
                                    "travelers_count",
                                    event.target.value
                                )
                            }
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Experiencias
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={form.experiences_count}
                            onChange={(event) =>
                                handleChange(
                                    "experiences_count",
                                    event.target.value
                                )
                            }
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Continentes
                        </label>

                        <input
                            type="number"
                            min="0"
                            value={form.continents_count}
                            onChange={(event) =>
                                handleChange(
                                    "continents_count",
                                    event.target.value
                                )
                            }
                            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Imágenes del hero
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Selecciona una imagen actual y carga una nueva para
                        reemplazarla en esa misma posición.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                    Imágenes actuales
                                </h3>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Haz click sobre una imagen para
                                    seleccionarla.
                                </p>
                            </div>

                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                {existingImages.length} actual
                                {existingImages.length === 1 ? "" : "es"}
                            </span>
                        </div>

                        {existingImages.length > 0 ? (
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {existingImages.map((image, index) => {
                                    const isSelected =
                                        selectedImageIndex === index;
                                    const hasReplacement =
                                        Boolean(replacementPreviews[index]);

                                    return (
                                        <button
                                            type="button"
                                            key={`${image.image_url}-${index}`}
                                            onClick={() =>
                                                handleSelectImage(index)
                                            }
                                            className={`group relative h-48 overflow-hidden rounded-2xl border bg-gray-50 text-left transition dark:bg-gray-900 ${
                                                isSelected
                                                    ? "border-brand-500 ring-4 ring-brand-500/15"
                                                    : "border-gray-200 hover:border-brand-300 dark:border-gray-800"
                                            }`}
                                        >
                                            <Image
                                                src={image.image_url}
                                                alt={
                                                    image.name ||
                                                    `Imagen actual ${
                                                        index + 1
                                                    }`
                                                }
                                                fill
                                                unoptimized
                                                className="object-cover transition duration-300 group-hover:scale-105"
                                            />

                                            <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                                                Actual #{index + 1}
                                            </div>

                                            {isSelected && (
                                                <div className="absolute right-3 top-3 rounded-full bg-brand-500 px-3 py-1 text-xs font-medium text-white">
                                                    Seleccionada
                                                </div>
                                            )}

                                            {hasReplacement && (
                                                <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white">
                                                    Tiene reemplazo listo
                                                </div>
                                            )}

                                            {!hasReplacement && image.name && (
                                                <div className="absolute bottom-3 left-3 right-3 truncate rounded-lg bg-black/60 px-3 py-2 text-xs text-white backdrop-blur">
                                                    {image.name}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="mt-4 flex h-48 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                                No hay imágenes actuales.
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                    Reemplazo de imagen
                                </h3>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Primero selecciona una imagen actual y luego
                                    carga su reemplazo.
                                </p>
                            </div>

                            {Object.keys(replacementFiles).length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleClearAllReplacements}
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                                >
                                    Limpiar todo
                                </button>
                            )}
                        </div>

                        {selectedImage ? (
                            <div className="mt-4 rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Imagen seleccionada: #{selectedImageIndex! + 1}
                                </p>

                                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                                            Actual
                                        </p>

                                        <div className="relative h-40 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                                            <Image
                                                src={selectedImage.image_url}
                                                alt={
                                                    selectedImage.name ||
                                                    "Imagen seleccionada"
                                                }
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                                            Nuevo reemplazo
                                        </p>

                                        {selectedImageIndex !== null &&
                                        replacementPreviews[
                                            selectedImageIndex
                                        ] ? (
                                            <div className="relative h-40 overflow-hidden rounded-xl border border-brand-200 bg-brand-50 dark:border-brand-500/20 dark:bg-brand-500/10">
                                                <Image
                                                    src={
                                                        replacementPreviews[
                                                            selectedImageIndex
                                                        ]
                                                    }
                                                    alt="Nuevo reemplazo"
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveReplacement(
                                                            selectedImageIndex
                                                        )
                                                    }
                                                    className="absolute right-2 top-2 rounded-lg bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur hover:bg-black/75"
                                                >
                                                    Quitar
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleOpenFileInput}
                                                className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 text-center transition hover:border-brand-500 hover:bg-brand-50/40 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-500 dark:hover:bg-brand-500/10"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-300">
                                                    <svg
                                                        className="h-5 w-5"
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
                                                    Seleccionar reemplazo
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    PNG, JPG, JPEG o WEBP
                                                </p>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleOpenFileInput}
                                        className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
                                    >
                                        Cambiar imagen seleccionada
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 flex h-48 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                                Selecciona una imagen actual para cargar su
                                reemplazo.
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleReplacementImageChange}
                            className="hidden"
                        />

                        {Object.keys(replacementFiles).length > 0 && (
                            <div className="mt-4 rounded-xl bg-green-50 p-4 dark:bg-green-500/10">
                                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                                    {Object.keys(replacementFiles).length}{" "}
                                    reemplazo
                                    {Object.keys(replacementFiles).length === 1
                                        ? ""
                                        : "s"}{" "}
                                    listo
                                    {Object.keys(replacementFiles).length === 1
                                        ? ""
                                        : "s"}{" "}
                                    para guardar.
                                </p>

                                <p className="mt-1 text-xs text-green-700/80 dark:text-green-400/80">
                                    Al guardar, se enviarán solo las posiciones
                                    seleccionadas para reemplazo.
                                </p>
                            </div>
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
                    {loading ? "Guardando..." : "Guardar cambios"}
                </button>
            </div>
        </form>
    );
}