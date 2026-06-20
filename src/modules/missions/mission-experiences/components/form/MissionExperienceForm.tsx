"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { MissionExperience, MissionExperiencePayload } from "../../types";

interface Props {
  initialData?: MissionExperience | null;
  loading?: boolean;
  imageDeletingUuid?: string | null;
  onSubmit: (payload: MissionExperiencePayload) => Promise<void> | void;
  onDeleteCurrentImage?: (imageUuid: string) => Promise<void> | void;
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

type ItineraryFormState = {
  day: string;
  order: string;
  title: string;
  description: string;
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

const initialItinerary: ItineraryFormState = {
  day: "1",
  order: "1",
  title: "",
  description: "",
};

const MAX_IMAGES = 4;

export default function MissionExperienceForm({
  initialData = null,
  loading = false,
  imageDeletingUuid = null,
  onSubmit,
  onDeleteCurrentImage,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<MissionExperienceFormState>(initialState);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [itineraries, setItineraries] = useState<ItineraryFormState[]>([
    initialItinerary,
  ]);

  const currentImages = initialData?.images ?? [];
  const totalImagesCount = currentImages.length + imageFiles.length;
  const availableImageSlots = Math.max(MAX_IMAGES - totalImagesCount, 0);

  useEffect(() => {
    if (!initialData) {
      setForm(initialState);
      setFeatures([""]);
      setItineraries([initialItinerary]);
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

    setFeatures(
      initialData.features && initialData.features.length > 0
        ? initialData.features.map((item) => item.feature)
        : [""]
    );

    setItineraries(
      initialData.itineraries && initialData.itineraries.length > 0
        ? initialData.itineraries.map((item) => ({
            day: String(item.day ?? ""),
            order: String(item.order ?? ""),
            title: item.title ?? "",
            description: item.description ?? "",
          }))
        : [initialItinerary]
    );

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

  const handleFeatureChange = (index: number, value: string) => {
    setFeatures((prev) =>
      prev.map((feature, featureIndex) =>
        featureIndex === index ? value : feature
      )
    );
  };

  const handleAddFeature = () => {
    setFeatures((prev) => [...prev, ""]);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures((prev) => {
      const nextFeatures = prev.filter(
        (_, featureIndex) => featureIndex !== index
      );

      return nextFeatures.length > 0 ? nextFeatures : [""];
    });
  };

  const handleItineraryChange = (
    index: number,
    field: keyof ItineraryFormState,
    value: string
  ) => {
    setItineraries((prev) =>
      prev.map((itinerary, itineraryIndex) =>
        itineraryIndex === index
          ? {
              ...itinerary,
              [field]: value,
            }
          : itinerary
      )
    );
  };

  const handleAddItinerary = () => {
    setItineraries((prev) => [
      ...prev,
      {
        day: String(prev.length + 1),
        order: String(prev.length + 1),
        title: "",
        description: "",
      },
    ]);
  };

  const handleRemoveItinerary = (index: number) => {
    setItineraries((prev) => {
      const nextItineraries = prev.filter(
        (_, itineraryIndex) => itineraryIndex !== index
      );

      return nextItineraries.length > 0
        ? nextItineraries
        : [initialItinerary];
    });
  };

  const handleImagesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) return;

    if (availableImageSlots <= 0) {
      alert(
        "Ya alcanzaste el máximo de 4 imágenes. Elimina una imagen actual antes de subir otra."
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    const filesToAdd = selectedFiles.slice(0, availableImageSlots);

    if (selectedFiles.length > availableImageSlots) {
      alert(`Solo puedes agregar ${availableImageSlots} imagen(es) más.`);
    }

    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...filesToAdd]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveSelectedImage = (index: number) => {
    setImagePreviews((prev) => {
      const previewToRemove = prev[index];

      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove);
      }

      return prev.filter((_, previewIndex) => previewIndex !== index);
    });

    setImageFiles((prev) =>
      prev.filter((_, fileIndex) => fileIndex !== index)
    );
  };

  const clearSelectedImages = () => {
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

    setImageFiles([]);
    setImagePreviews([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteCurrentImage = async (imageUuid: string) => {
    if (!onDeleteCurrentImage) return;

    await onDeleteCurrentImage(imageUuid);
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
      images: imageFiles.slice(0, MAX_IMAGES),
      features: features
        .map((feature) => feature.trim())
        .filter(Boolean),
      itineraries: itineraries
        .map((itinerary) => ({
          day: itinerary.day,
          order: itinerary.order,
          title: itinerary.title.trim(),
          description: itinerary.description.trim(),
        }))
        .filter((itinerary) => itinerary.day && itinerary.title),
    });
  };

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
              Características
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Agrega las características incluidas en la experiencia.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddFeature}
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          >
            Agregar característica
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={feature}
                onChange={(event) =>
                  handleFeatureChange(index, event.target.value)
                }
                placeholder={`Característica ${index + 1}`}
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
              />

              <button
                type="button"
                onClick={() => handleRemoveFeature(index)}
                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Itinerario
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Agrega los días y actividades del itinerario.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddItinerary}
            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          >
            Agregar itinerario
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {itineraries.map((itinerary, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  Itinerario {index + 1}
                </h3>

                <button
                  type="button"
                  onClick={() => handleRemoveItinerary(index)}
                  className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:hover:bg-red-500/10"
                >
                  Quitar
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <InputField
                  label="Día"
                  type="number"
                  value={itinerary.day}
                  placeholder="Ej: 1"
                  onChange={(value) =>
                    handleItineraryChange(index, "day", value)
                  }
                />

                <InputField
                  label="Orden"
                  type="number"
                  value={itinerary.order}
                  placeholder="Ej: 1"
                  onChange={(value) =>
                    handleItineraryChange(index, "order", value)
                  }
                />

                <InputField
                  label="Título"
                  value={itinerary.title}
                  placeholder="Ej: Aterrizaje de emergencia"
                  onChange={(value) =>
                    handleItineraryChange(index, "title", value)
                  }
                />

                <div className="lg:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Descripción
                  </label>

                  <textarea
                    value={itinerary.description}
                    onChange={(event) =>
                      handleItineraryChange(
                        index,
                        "description",
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder="Ej: Avión peligroso"
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Imágenes de la experiencia
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Puedes tener un máximo de 4 imágenes en total.
            </p>
          </div>

          {imageFiles.length > 0 && (
            <button
              type="button"
              onClick={clearSelectedImages}
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
            >
              Quitar nuevas imágenes
            </button>
          )}
        </div>

        {currentImages.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              Imágenes actuales
            </h3>

            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

                  {onDeleteCurrentImage && (
                    <button
                      type="button"
                      disabled={loading || imageDeletingUuid === image.uuid}
                      onClick={() => handleDeleteCurrentImage(image.uuid)}
                      className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {imageDeletingUuid === image.uuid
                        ? "Eliminando..."
                        : "Eliminar"}
                    </button>
                  )}
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
              {MAX_IMAGES}.
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

                  <button
                    type="button"
                    onClick={() => handleRemoveSelectedImage(index)}
                    className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                  >
                    Quitar
                  </button>
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
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenDatePicker = () => {
    if (type !== "date") return;

    try {
      inputRef.current?.showPicker?.();
    } catch {
      // Algunos navegadores pueden bloquear showPicker si no viene de interacción directa.
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <input
        ref={inputRef}
        type={type}
        step={step}
        value={value}
        onClick={handleOpenDatePicker}
        onFocus={handleOpenDatePicker}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90 ${
          type === "date" ? "cursor-pointer" : ""
        }`}
      />
    </div>
  );
}