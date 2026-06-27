import { RefObject } from "react";
import Image from "next/image";

import Button from "@/shared/components/ui/button/Button";
import FormSection from "@/shared/components/form/Form";

type HeroImage = {
  uuid: string;
  name?: string | null;
  image_url: string;
};

interface Props {
  existingImages: HeroImage[];
  imagePreviews: string[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImagesChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onClearImages: () => void;
  onDeleteExistingImage: (imageUuid: string) => void;
  deletingImageUuid?: string | null;
}

export default function HomeHeroImagesSection({
  existingImages,
  imagePreviews,
  fileInputRef,
  onImagesChange,
  onRemoveImage,
  onClearImages,
  onDeleteExistingImage,
  deletingImageUuid = null,
}: Props) {
  const hasExistingImages = existingImages.length > 0;
  const hasNewImages = imagePreviews.length > 0;

  return (
    <FormSection
      title="Imágenes del hero"
      description="Sube una o varias imágenes para el hero. Las imágenes actuales se mantienen mientras no las elimines desde su acción correspondiente."
      action={
        hasNewImages ? (
          <Button size="sm" variant="outline" onClick={onClearImages}>
            Quitar nuevas imágenes
          </Button>
        ) : null
      }
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                Imágenes actuales
              </h3>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Estas son las imágenes actualmente registradas.
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {existingImages.length} actual
              {existingImages.length === 1 ? "" : "es"}
            </span>
          </div>

          {hasExistingImages ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {existingImages.map((image, index) => {
                const isDeleting = deletingImageUuid === image.uuid;

                return (
                  <div
                    key={image.uuid}
                    className="group relative h-48 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 text-left transition dark:border-gray-800 dark:bg-gray-900"
                  >
                    <Image
                      src={image.image_url}
                      alt={image.name || `Imagen actual ${index + 1}`}
                      fill
                      unoptimized
                      className={`object-cover transition duration-300 group-hover:scale-105 ${isDeleting ? "opacity-50" : ""
                        }`}
                    />

                    <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                      Actual #{index + 1}
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteExistingImage(image.uuid)}
                      disabled={isDeleting}
                      className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isDeleting ? "Eliminando..." : "Eliminar"}
                    </button>

                    {image.name && (
                      <div className="absolute bottom-3 left-3 right-3 truncate rounded-lg bg-black/60 px-3 py-2 text-xs text-white backdrop-blur">
                        {image.name}
                      </div>
                    )}
                  </div>
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
                Subir nuevas imágenes
              </h3>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Puedes seleccionar varias imágenes a la vez.
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onImagesChange}
            className="hidden"
            id="home-hero-images"
          />

          <label
            htmlFor="home-hero-images"
            className="mt-4 flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 text-center transition hover:border-brand-500 hover:bg-brand-50/40 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-500 dark:hover:bg-brand-500/10"
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
              Click para subir imágenes
            </p>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, JPEG o WEBP
            </p>
          </label>

          {hasNewImages && (
            <div className="mt-5">
              <p className="mb-3 text-sm font-semibold text-gray-800 dark:text-white/90">
                Nuevas imágenes seleccionadas
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={preview}
                    className="relative h-40 overflow-hidden rounded-xl border border-brand-200 bg-brand-50 dark:border-brand-500/20 dark:bg-brand-500/10"
                  >
                    <Image
                      src={preview}
                      alt={`Nueva imagen ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />

                    <div className="absolute left-2 top-2 rounded-lg bg-brand-500 px-3 py-1 text-xs font-medium text-white">
                      Nueva #{index + 1}
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      className="absolute right-2 top-2 rounded-lg bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur hover:bg-black/75"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-green-50 p-4 dark:bg-green-500/10">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  {imagePreviews.length} imagen
                  {imagePreviews.length === 1 ? "" : "es"} lista
                  {imagePreviews.length === 1 ? "" : "s"} para guardar.
                </p>

                <p className="mt-1 text-xs text-green-700/80 dark:text-green-400/80">
                  Al guardar, se enviarán las nuevas imágenes seleccionadas.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
}