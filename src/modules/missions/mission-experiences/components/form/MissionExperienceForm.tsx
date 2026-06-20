"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

import {
  MissionExperience,
  MissionExperiencePayload,
} from "../../types";

interface Props {
  initialData?: MissionExperience | null;
  loading?: boolean;
  onSubmit: (payload: MissionExperiencePayload) => Promise<void> | void;
}

type MissionExperienceFormState = {
  name: string;
  short_description: string;
  release_date: string;
  number_seats: string;
  seats_used: string;
  days: string;
  nights: string;
  raiting: string;
  subtitle: string;
  long_description: string;
  investment: string;
};

const initialState: MissionExperienceFormState = {
  name: "",
  short_description: "",
  release_date: "",
  number_seats: "",
  seats_used: "0",
  days: "",
  nights: "",
  raiting: "",
  subtitle: "",
  long_description: "",
  investment: "",
};

export default function MissionExperienceForm({
  initialData = null,
  loading = false,
  onSubmit,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] =
    useState<MissionExperienceFormState>(initialState);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!initialData) {
      setForm(initialState);
      clearSelectedImages();
      return;
    }

    setForm({
      name: initialData.name ?? "",
      short_description: initialData.short_description ?? "",
      release_date: initialData.release_date ?? "",
      number_seats: String(initialData.number_seats ?? ""),
      seats_used: String(initialData.seats_used ?? "0"),
      days: String(initialData.days ?? ""),
      nights: String(initialData.nights ?? ""),
      raiting: String(initialData.raiting ?? ""),
      subtitle: initialData.subtitle ?? "",
      long_description: initialData.long_description ?? "",
      investment: String(initialData.investment ?? ""),
    });

    clearSelectedImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleChange = (
    field: keyof MissionExperienceFormState,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImagesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) return;

    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const clearSelectedImages = () => {
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

    setImageFiles([]);
    setImagePreviews([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit({
      name: form.name,
      short_description: form.short_description,
      release_date: form.release_date,
      number_seats: form.number_seats,
      seats_used: form.seats_used,
      days: form.days,
      nights: form.nights,
      raiting: form.raiting,
      subtitle: form.subtitle,
      long_description: form.long_description,
      investment: form.investment,
      images: imageFiles,
    });
  };

  const currentImages = initialData?.images ?? [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Información de la experiencia
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Completa los datos principales de la experiencia.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <InputField
            label="Nombre"
            value={form.name}
            placeholder="Ej: Rabat 7"
            onChange={(value) => handleChange("name", value)}
          />

          <InputField
            label="Subtítulo"
            value={form.subtitle}
            placeholder="Ej: Rabat una ciudad completa"
            onChange={(value) => handleChange("subtitle", value)}
          />

          <InputField
            label="Descripción corta"
            value={form.short_description}
            placeholder="Ej: Lorem ipsum demo"
            onChange={(value) => handleChange("short_description", value)}
          />

          <InputField
            label="Fecha de salida"
            type="date"
            value={form.release_date}
            onChange={(value) => handleChange("release_date", value)}
          />

          <InputField
            label="Número de cupos"
            type="number"
            value={form.number_seats}
            placeholder="Ej: 15"
            onChange={(value) => handleChange("number_seats", value)}
          />

          <InputField
            label="Cupos usados"
            type="number"
            value={form.seats_used}
            placeholder="Ej: 0"
            onChange={(value) => handleChange("seats_used", value)}
          />

          <InputField
            label="Días"
            type="number"
            value={form.days}
            placeholder="Ej: 5"
            onChange={(value) => handleChange("days", value)}
          />

          <InputField
            label="Noches"
            type="number"
            value={form.nights}
            placeholder="Ej: 4"
            onChange={(value) => handleChange("nights", value)}
          />

          <InputField
            label="Rating"
            type="number"
            step="0.1"
            value={form.raiting}
            placeholder="Ej: 4.6"
            onChange={(value) => handleChange("raiting", value)}
          />

          <InputField
            label="Inversión"
            type="number"
            value={form.investment}
            placeholder="Ej: 1953"
            onChange={(value) => handleChange("investment", value)}
          />
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Descripción larga
          </label>

          <textarea
            value={form.long_description}
            onChange={(event) =>
              handleChange("long_description", event.target.value)
            }
            rows={5}
            placeholder="Escribe la descripción completa de la experiencia..."
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Imágenes de la experiencia
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Puedes seleccionar una o varias imágenes.
            </p>
          </div>

          {imageFiles.length > 0 && (
            <button
              type="button"
              onClick={clearSelectedImages}
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
            >
              Quitar selección
            </button>
          )}
        </div>

        {currentImages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              Imágenes actuales
            </h3>

            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {currentImages.map((image) => (
                <div
                  key={image.uuid}
                  className="relative h-40 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
                >
                  <Image
                    src={image.image_url}
                    alt={image.name || "Imagen actual"}
                    fill
                    unoptimized
                    className="object-cover"
                  />

                  <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                    Actual
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className="hidden"
            id="experience-images"
          />

          <label
            htmlFor="experience-images"
            className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 text-center transition hover:border-brand-500 hover:bg-brand-50/40 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-500 dark:hover:bg-brand-500/10"
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
              Click para seleccionar imágenes
            </p>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, JPEG o WEBP
            </p>
          </label>
        </div>

        {imagePreviews.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              Nuevas imágenes seleccionadas
            </h3>

            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

                  <div className="absolute left-3 top-3 rounded-full bg-brand-500 px-3 py-1 text-xs font-medium text-white">
                    Nueva
                  </div>
                </div>
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
              ? "Actualizar experiencia"
              : "Crear experiencia"}
        </button>
      </div>
    </form>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <input
        type={type}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
      />
    </div>
  );
}