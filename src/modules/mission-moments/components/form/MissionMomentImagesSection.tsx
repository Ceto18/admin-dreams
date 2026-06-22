"use client";

import { RefObject } from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";

import Button from "@/shared/components/ui/button/Button";
import { MissionMomentImage } from "../../types";

interface Props {
  currentImages: MissionMomentImage[];
  imagePreviews: string[];
  imageFiles: File[];
  availableImageSlots: number;
  maxImages: number;
  fileInputRef: RefObject<HTMLInputElement | null>;
  loading?: boolean;
  imageDeletingUuid?: string | null;
  canDeleteCurrentImage?: boolean;
  onImagesChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveSelectedImage: (index: number) => void;
  onClearSelectedImages: () => void;
  onDeleteCurrentImage?: (imageUuid: string) => void | Promise<void>;
}

export default function MissionMomentImagesSection({
  currentImages,
  imagePreviews,
  imageFiles,
  availableImageSlots,
  maxImages,
  fileInputRef,
  loading = false,
  imageDeletingUuid = null,
  canDeleteCurrentImage = false,
  onImagesChange,
  onRemoveSelectedImage,
  onClearSelectedImages,
  onDeleteCurrentImage,
}: Props) {
  const hasCurrentImages = currentImages.length > 0;
  const hasNewImages = imagePreviews.length > 0;

  const handleDeleteCurrentImage = async (imageUuid: string) => {
    if (!onDeleteCurrentImage) return;

    await onDeleteCurrentImage(imageUuid);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Imágenes del momento
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Puedes subir hasta {maxImages} imágenes por momento.
          </p>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Espacios disponibles: {availableImageSlots}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onImagesChange}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            disabled={loading || availableImageSlots <= 0}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Seleccionar imágenes
          </Button>

          {hasNewImages && (
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={onClearSelectedImages}
            >
              Limpiar selección
            </Button>
          )}
        </div>
      </div>

      {hasCurrentImages && (
        <div className="mb-6">
          <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Imágenes actuales
          </h4>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {currentImages.map((image) => {
              const isDeleting = imageDeletingUuid === image.uuid;
              const canDelete =
                canDeleteCurrentImage && Boolean(onDeleteCurrentImage);

              return (
                <div
                  key={image.uuid}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
                >
                  {image.image_url ? (
                    <img
                      src={image.image_url}
                      alt={image.name || "Imagen del momento"}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center text-gray-400">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}

                  {canDelete && (
                    <button
                      type="button"
                      disabled={loading || isDeleting}
                      onClick={() => handleDeleteCurrentImage(image.uuid)}
                      className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-red-500 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-900/90 dark:hover:bg-red-500/10"
                      title="Eliminar imagen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-black/55 px-3 py-2">
                    <p className="truncate text-xs text-white">
                      {isDeleting ? "Eliminando..." : image.name || "Imagen"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hasNewImages && (
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Nuevas imágenes seleccionadas
          </h4>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {imagePreviews.map((preview, index) => (
              <div
                key={preview}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
              >
                <img
                  src={preview}
                  alt={`Imagen seleccionada ${index + 1}`}
                  className="h-40 w-full object-cover"
                />

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => onRemoveSelectedImage(index)}
                  className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-red-500 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-900/90 dark:hover:bg-red-500/10"
                  title="Quitar imagen seleccionada"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 bg-black/55 px-3 py-2">
                  <p className="truncate text-xs text-white">
                    {imageFiles[index]?.name || "Nueva imagen"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hasCurrentImages && !hasNewImages && (
        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-900">
          <ImageIcon className="mb-3 h-10 w-10 text-gray-400" />

          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            No hay imágenes seleccionadas.
          </p>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Selecciona una o varias imágenes para este momento.
          </p>
        </div>
      )}
    </div>
  );
}