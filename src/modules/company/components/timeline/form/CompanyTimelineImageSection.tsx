// src/modules/company-timeline/components/form/CompanyTimelineImageSection.tsx

"use client";

import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

import Button from "@/shared/components/ui/button/Button";

interface Props {
  currentImageUrl?: string | null;
  imagePreview?: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  loading?: boolean;

  onImageChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  onRemoveSelectedImage: () => void;
}

export default function CompanyTimelineImageSection({
  currentImageUrl,
  imagePreview,
  fileInputRef,
  loading = false,
  onImageChange,
  onRemoveSelectedImage,
}: Props) {
  const displayedImage = imagePreview ?? currentImageUrl ?? null;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Imagen del acontecimiento
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Selecciona una imagen representativa de esta etapa de la empresa.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        disabled={loading}
        onChange={onImageChange}
        className="hidden"
      />

      {displayedImage ? (
        <div className="space-y-4">
          <div className="relative h-64 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <Image
              src={displayedImage}
              alt="Vista previa del acontecimiento"
              fill
              unoptimized
              className="object-cover"
            />

            {imagePreview && (
              <button
                type="button"
                onClick={onRemoveSelectedImage}
                disabled={loading}
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 disabled:opacity-60"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? "Cambiar imagen" : "Reemplazar imagen"}
            </Button>

            {imagePreview && (
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={onRemoveSelectedImage}
              >
                Cancelar selección
              </Button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={() => fileInputRef.current?.click()}
          className="flex min-h-52 w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 text-center transition hover:border-brand-500 hover:bg-brand-50/40 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900/50"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
            <ImagePlus size={22} />
          </span>

          <span className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            Seleccionar imagen
          </span>

          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            JPG, PNG o WEBP
          </span>
        </button>
      )}
    </section>
  );
}