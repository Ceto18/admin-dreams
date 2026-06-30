"use client";

import { RefObject } from "react";
import Image from "next/image";

interface Props {
    currentImage: string;
    imageFile: File | null;
    imagePreview: string;
    fileInputRef: RefObject<HTMLInputElement | null>;
    onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveSelectedImage: () => void;
}

export default function MissionImageSection({
    currentImage,
    imageFile,
    imagePreview,
    fileInputRef,
    onImageChange,
    onRemoveSelectedImage,
}: Props) {
    return (
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
                                onClick={onRemoveSelectedImage}
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
                        onChange={onImageChange}
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
                            Si no seleccionas una nueva imagen, se mantendrá la
                            imagen actual.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}