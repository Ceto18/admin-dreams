// src/modules/people/components/form/PersonGallerySection.tsx

"use client";

import type { RefObject } from "react";
import type { Person, PersonImage } from "../../types";
import { getPersonGalleryImageUrl } from "./personFormUtils";

type Props = {
  initialData?: Person | null;
  imagePreviews: string[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  loading?: boolean;
  onImagesChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveSelectedImages: () => void;
  onDeleteImage?: (imageUuid: string) => Promise<void> | void;
};

export default function PersonGallerySection({
  initialData = null,
  imagePreviews,
  fileInputRef,
  loading = false,
  onImagesChange,
  onRemoveSelectedImages,
  onDeleteImage,
}: Props) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
        Galería de imágenes
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Puedes subir una o varias imágenes adicionales.
      </p>

      <div className="mt-5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onImagesChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-600 dark:text-gray-400"
        />

        {initialData?.images && initialData.images.length > 0 && (
          <div className="mt-5">
            <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Imágenes actuales
            </p>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {initialData.images.map((image, index) => {
                const imageUrl = getPersonGalleryImageUrl(
                  image as string | PersonImage
                );
                const imageUuid =
                  typeof image === "string" ? "" : image.uuid ?? "";

                if (!imageUrl) return null;

                return (
                  <div
                    key={imageUuid || imageUrl || index}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <img
                      src={imageUrl}
                      alt={`Imagen actual ${index + 1}`}
                      className="h-28 w-full object-cover"
                    />

                    {imageUuid && onDeleteImage && (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => onDeleteImage(imageUuid)}
                        className="w-full border-t border-gray-200 bg-white px-3 py-2 text-xs font-medium text-error-500 hover:bg-error-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-error-500/10"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {imagePreviews.length > 0 && (
          <div className="mt-5">
            <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Nuevas imágenes seleccionadas
            </p>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {imagePreviews.map((preview, index) => (
                <div
                  key={preview}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
                >
                  <img
                    src={preview}
                    alt={`Imagen ${index + 1}`}
                    className="h-28 w-full object-cover"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onRemoveSelectedImages}
              className="mt-3 text-sm font-medium text-error-500 hover:text-error-600"
            >
              Quitar imágenes seleccionadas
            </button>
          </div>
        )}
      </div>
    </section>
  );
}