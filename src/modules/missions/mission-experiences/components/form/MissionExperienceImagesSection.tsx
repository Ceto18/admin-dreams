import { RefObject } from "react";

import FormSection from "@/shared/components/form/Form";
import ImageCard from "@/shared/components/form/ImageCard";
import Button from "@/shared/components/ui/button/Button";

import { MissionExperience } from "../../types";

interface Props {
  currentImages: NonNullable<MissionExperience["images"]>;
  imagePreviews: string[];
  imageFiles: File[];
  availableImageSlots: number;
  maxImages: number;
  fileInputRef: RefObject<HTMLInputElement | null>;
  loading?: boolean;
  imageDeletingUuid?: string | null;
  canDeleteCurrentImage: boolean;
  onImagesChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveSelectedImage: (index: number) => void;
  onClearSelectedImages: () => void;
  onDeleteCurrentImage: (imageUuid: string) => void | Promise<void>;
}

export default function MissionExperienceImagesSection({
  currentImages,
  imagePreviews,
  imageFiles,
  availableImageSlots,
  maxImages,
  fileInputRef,
  loading = false,
  imageDeletingUuid = null,
  canDeleteCurrentImage,
  onImagesChange,
  onRemoveSelectedImage,
  onClearSelectedImages,
  onDeleteCurrentImage,
}: Props) {
  return (
    <FormSection
      title="Imágenes de la experiencia"
      description="Puedes tener un máximo de 4 imágenes en total."
      action={
        imageFiles.length > 0 ? (
          <Button size="sm" variant="outline" onClick={onClearSelectedImages}>
            Quitar nuevas imágenes
          </Button>
        ) : null
      }
    >
      {currentImages.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Imágenes actuales
          </h3>

          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {currentImages.map((image) => (
              <ImageCard
                key={image.uuid}
                src={image.image_url}
                alt={image.name || "Imagen actual"}
                badge="Actual"
                badgeClassName="bg-black/60"
                buttonText={
                  canDeleteCurrentImage
                    ? imageDeletingUuid === image.uuid
                      ? "Eliminando..."
                      : "Eliminar"
                    : undefined
                }
                disabled={loading || imageDeletingUuid === image.uuid}
                onButtonClick={
                  canDeleteCurrentImage
                    ? () => onDeleteCurrentImage(image.uuid)
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      )}

      <div className={currentImages.length > 0 ? "mt-6" : ""}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={availableImageSlots <= 0}
          onChange={onImagesChange}
          className="hidden"
          id="experience-images"
        />

        <label
          htmlFor={availableImageSlots <= 0 ? undefined : "experience-images"}
          className={`flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed px-4 text-center transition ${
            availableImageSlots <= 0
              ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60 dark:border-gray-800 dark:bg-gray-900"
              : "cursor-pointer border-gray-300 bg-gray-50 hover:border-brand-500 hover:bg-brand-50/40 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-500 dark:hover:bg-brand-500/10"
          }`}
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
            {availableImageSlots <= 0
              ? "Máximo de imágenes alcanzado"
              : "Click para seleccionar imágenes"}
          </p>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG, JPEG o WEBP. Disponibles: {availableImageSlots} de{" "}
            {maxImages}.
          </p>
        </label>
      </div>

      {imagePreviews.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Nuevas imágenes seleccionadas
          </h3>

          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {imagePreviews.map((preview, index) => (
              <ImageCard
                key={preview}
                src={preview}
                alt={`Nueva imagen ${index + 1}`}
                badge="Nueva"
                badgeClassName="bg-brand-500"
                containerClassName="border-brand-200 bg-brand-50 dark:border-brand-500/20 dark:bg-brand-500/10"
                buttonText="Quitar"
                onButtonClick={() => onRemoveSelectedImage(index)}
              />
            ))}
          </div>
        </div>
      )}

      {!imageFiles.length && currentImages.length > 0 && (
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Si no seleccionas nuevas imágenes, se mantendrán las imágenes
          actuales.
        </p>
      )}
    </FormSection>
  );
}