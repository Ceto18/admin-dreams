// src/modules/people/components/form/PersonProfilePhotoSection.tsx

"use client";

import type { RefObject } from "react";

type Props = {
  visiblePhoto: string;
  photoFile: File | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onPhotoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveSelectedPhoto: () => void;
};

export default function PersonProfilePhotoSection({
  visiblePhoto,
  photoFile,
  fileInputRef,
  onPhotoChange,
  onRemoveSelectedPhoto,
}: Props) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
        Foto de perfil
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Sube la foto principal de la persona.
      </p>

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
          {visiblePhoto ? (
            <img
              src={visiblePhoto}
              alt="Foto de perfil"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">Sin foto</span>
          )}
        </div>

        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onPhotoChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-600 dark:text-gray-400"
          />

          {photoFile && (
            <button
              type="button"
              onClick={onRemoveSelectedPhoto}
              className="mt-3 text-sm font-medium text-error-500 hover:text-error-600"
            >
              Quitar foto seleccionada
            </button>
          )}
        </div>
      </div>
    </section>
  );
}