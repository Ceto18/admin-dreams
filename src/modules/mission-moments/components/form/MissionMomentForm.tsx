"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import Button from "@/shared/components/ui/button/Button";

import { MissionMoment, MissionMomentPayload } from "../../types";

import MissionMomentInfoSection from "./MissionMomentInfoSection";
import MissionMomentImagesSection from "./MissionMomentImagesSection";

import { MissionMomentFormState, MomentField } from "./types";

interface Props {
  initialData?: MissionMoment | null;
  loading?: boolean;
  imageDeletingUuid?: string | null;
  onSubmit: (payload: MissionMomentPayload) => Promise<void> | void;
  onDeleteCurrentImage?: (imageUuid: string) => Promise<void> | void;
}

const initialState: MissionMomentFormState = {
  title: "",
  description: "",
  proverb: "",
  place: "",
  experience: "",
  ideal: "",
  sensation: "",
};

const MAX_IMAGES = 4;

const momentFields: MomentField[] = [
  {
    name: "title",
    label: "Título",
    placeholder: "Ej: Atardecer en el desierto",
  },
  {
    name: "place",
    label: "Lugar",
    placeholder: "Ej: Desierto de Marruecos",
  },
  {
    name: "experience",
    label: "Experiencia",
    placeholder: "Ej: Atardecer y campamento",
  },
  {
    name: "ideal",
    label: "Momento ideal",
    placeholder: "Ej: Últimas horas del día",
  },
  {
    name: "sensation",
    label: "Sensación",
    placeholder: "Ej: Calma, asombro y conexión",
  },
  {
    name: "description",
    label: "Descripción",
    placeholder:
      "Ej: Un instante entre dunas, silencio y cielo dorado...",
  },
  {
    name: "proverb",
    label: "Proverbio",
    placeholder:
      "Ej: Permite que el silencio del desierto toque tu alma...",
  },
];

export default function MissionMomentForm({
  initialData = null,
  loading = false,
  imageDeletingUuid = null,
  onSubmit,
  onDeleteCurrentImage,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<MissionMomentFormState>(initialState);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const currentImages = initialData?.images ?? [];
  const totalImagesCount = currentImages.length + imageFiles.length;
  const availableImageSlots = Math.max(MAX_IMAGES - totalImagesCount, 0);

  useEffect(() => {
    if (!initialData) {
      setForm(initialState);
      clearSelectedImages();
      return;
    }

    setForm({
      title: initialData.title ?? "",
      description: initialData.description ?? "",
      proverb: initialData.proverb ?? "",
      place: initialData.place ?? "",
      experience: initialData.experience ?? "",
      ideal: initialData.ideal ?? "",
      sensation: initialData.sensation ?? "",
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
    field: keyof MissionMomentFormState,
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
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) return;

    const validImages = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validImages.length === 0) {
      alert("Solo puedes seleccionar archivos de imagen.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    if (availableImageSlots <= 0) {
      alert(
        "Ya alcanzaste el máximo de 4 imágenes. Elimina una imagen actual antes de subir otra."
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    const filesToAdd = validImages.slice(0, availableImageSlots);

    if (validImages.length > availableImageSlots) {
      alert(`Solo puedes agregar ${availableImageSlots} imagen(es) más.`);
    }

    const newPreviews = filesToAdd.map((file) =>
      URL.createObjectURL(file)
    );

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
      title: form.title.trim(),
      description: form.description.trim(),
      proverb: form.proverb.trim(),
      place: form.place.trim(),
      experience: form.experience.trim(),
      ideal: form.ideal.trim(),
      sensation: form.sensation.trim(),
      images: imageFiles.slice(0, MAX_IMAGES),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <MissionMomentInfoSection
        form={form}
        fields={momentFields}
        onChange={handleChange}
      />

      <MissionMomentImagesSection
        currentImages={currentImages}
        imagePreviews={imagePreviews}
        imageFiles={imageFiles}
        availableImageSlots={availableImageSlots}
        maxImages={MAX_IMAGES}
        fileInputRef={fileInputRef}
        loading={loading}
        imageDeletingUuid={imageDeletingUuid}
        canDeleteCurrentImage={Boolean(onDeleteCurrentImage)}
        onImagesChange={handleImagesChange}
        onRemoveSelectedImage={handleRemoveSelectedImage}
        onClearSelectedImages={clearSelectedImages}
        onDeleteCurrentImage={handleDeleteCurrentImage}
      />

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Guardando..."
            : initialData
              ? "Actualizar momento"
              : "Crear momento"}
        </Button>
      </div>
    </form>
  );
}