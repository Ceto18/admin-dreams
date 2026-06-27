"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import Button from "@/shared/components/ui/button/Button";

import { Home, HomePayload } from "../../types";

import HomeHeroContentSection, {
  HeroFormState,
} from "./HomeHeroContentSection";
import HomeCountersSection from "./HomeCountersSection";
import HomeHeroImagesSection from "./HomeHeroImagesSection";

interface Props {
  initialData?: Home | null;
  loading?: boolean;
  deletingImageUuid?: string | null;
  onSubmit: (payload: HomePayload) => Promise<void> | void;
  onDeleteExistingImage: (imageUuid: string) => Promise<void> | void;
}

const initialState: HeroFormState = {
  title: "",
  highlight_text: "",
  description: "",
  destinations_count: "",
  travelers_count: "",
  experiences_count: "",
  continents_count: "",
};

export default function HomeForm({
  initialData = null,
  loading = false,
  deletingImageUuid = null,
  onSubmit,
  onDeleteExistingImage,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<HeroFormState>(initialState);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const existingImages = useMemo(() => {
    return initialData?.hero?.images ?? [];
  }, [initialData]);

  useEffect(() => {
    if (!initialData?.hero) {
      setForm(initialState);
      clearSelectedImages();
      return;
    }

    setForm({
      title: initialData.hero.title ?? "",
      highlight_text: initialData.hero.highlight_text ?? "",
      description: initialData.hero.description ?? "",
      destinations_count: String(initialData.hero.destinations_count ?? ""),
      travelers_count: String(initialData.hero.travelers_count ?? ""),
      experiences_count: String(initialData.hero.experiences_count ?? ""),
      continents_count: String(initialData.hero.continents_count ?? ""),
    });

    clearSelectedImages();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleChange = (field: keyof HeroFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) return;

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...selectedFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => {
      const previewToRemove = prev[index];

      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove);
      }

      return prev.filter((_, previewIndex) => previewIndex !== index);
    });

    setImageFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
  };

  function clearSelectedImages() {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));

    setImageFiles([]);
    setImagePreviews([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit({
      hero: {
        title: form.title,
        highlight_text: form.highlight_text,
        description: form.description,
        destinations_count: form.destinations_count,
        travelers_count: form.travelers_count,
        experiences_count: form.experiences_count,
        continents_count: form.continents_count,
        images: imageFiles,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <HomeHeroContentSection form={form} onChange={handleChange} />

      <HomeCountersSection form={form} onChange={handleChange} />

      <HomeHeroImagesSection
        existingImages={existingImages}
        imagePreviews={imagePreviews}
        fileInputRef={fileInputRef}
        onImagesChange={handleImagesChange}
        onRemoveImage={handleRemoveImage}
        onClearImages={clearSelectedImages}
        onDeleteExistingImage={onDeleteExistingImage}
        deletingImageUuid={deletingImageUuid}
      />

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}