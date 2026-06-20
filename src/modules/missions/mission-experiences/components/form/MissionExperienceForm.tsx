"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import Button from "@/shared/components/ui/button/Button";

import { MissionExperience, MissionExperiencePayload } from "../../types";

import MissionExperienceInfoSection from "./MissionExperienceInfoSection";
import MissionExperienceFeaturesSection from "./MissionExperienceFeaturesSection";
import MissionExperienceFileSection from "./MissionExperienceFileSection";
import MissionExperienceItinerarySection from "./MissionExperienceItinerarySection";
import MissionExperienceImagesSection from "./MissionExperienceImagesSection";

import {
  ExperienceField,
  ItineraryFormState,
  MissionExperienceFormState,
} from "./types";

interface Props {
  initialData?: MissionExperience | null;
  loading?: boolean;
  imageDeletingUuid?: string | null;
  onSubmit: (payload: MissionExperiencePayload) => Promise<void> | void;
  onDeleteCurrentImage?: (imageUuid: string) => Promise<void> | void;
}

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

const experienceFields: ExperienceField[] = [
  {
    name: "name",
    label: "Nombre",
    placeholder: "Ej: Rabat 7",
  },
  {
    name: "subtitle",
    label: "Subtítulo",
    placeholder: "Ej: Rabat una ciudad completa",
  },
  {
    name: "short_description",
    label: "Descripción corta",
    placeholder: "Ej: Lorem ipsum demo",
  },
  {
    name: "release_date",
    label: "Fecha de salida",
    type: "date",
  },
  {
    name: "number_seats",
    label: "Número de cupos",
    type: "number",
    placeholder: "Ej: 15",
  },
  {
    name: "seats_used",
    label: "Cupos usados",
    type: "number",
    placeholder: "Ej: 0",
  },
  {
    name: "days",
    label: "Días",
    type: "number",
    placeholder: "Ej: 5",
  },
  {
    name: "nights",
    label: "Noches",
    type: "number",
    placeholder: "Ej: 4",
  },
  {
    name: "raiting",
    label: "Rating",
    type: "number",
    step: "0.1",
    placeholder: "Ej: 4.6",
  },
  {
    name: "investment",
    label: "Inversión",
    type: "number",
    placeholder: "Ej: 1953",
  },
];

export default function MissionExperienceForm({
  initialData = null,
  loading = false,
  imageDeletingUuid = null,
  onSubmit,
  onDeleteCurrentImage,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const documentInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<MissionExperienceFormState>(initialState);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
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
      setDocumentFile(null);

      if (documentInputRef.current) {
        documentInputRef.current.value = "";
      }

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

    setDocumentFile(null);

    if (documentInputRef.current) {
      documentInputRef.current.value = "";
    }

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

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleDocumentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0] ?? null;

    if (!selectedFile) return;

    setDocumentFile(selectedFile);
  };

  const handleRemoveDocument = () => {
    setDocumentFile(null);

    if (documentInputRef.current) {
      documentInputRef.current.value = "";
    }
  };

  const handleDeleteCurrentImage = async (imageUuid: string) => {
    if (!onDeleteCurrentImage) return;

    await onDeleteCurrentImage(imageUuid);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

     console.log("documentFile en submit:", documentFile);

    await onSubmit({
      ...form,
      file_url: documentFile,
      images: imageFiles.slice(0, MAX_IMAGES),
      features: features.map((feature) => feature.trim()).filter(Boolean),
      itineraries: itineraries
        .map((itinerary) => ({
          ...itinerary,
          title: itinerary.title.trim(),
          description: itinerary.description.trim(),
        }))
        .filter((itinerary) => itinerary.day && itinerary.title),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <MissionExperienceInfoSection
        form={form}
        fields={experienceFields}
        onChange={handleChange}
      />

      <MissionExperienceFeaturesSection
        features={features}
        onAdd={handleAddFeature}
        onRemove={handleRemoveFeature}
        onChange={handleFeatureChange}
      />

      <MissionExperienceFileSection
        currentFileUrl={initialData?.file}
        documentFile={documentFile}
        documentInputRef={documentInputRef}
        onChange={handleDocumentChange}
        onRemove={handleRemoveDocument}
      />

      <MissionExperienceItinerarySection
        itineraries={itineraries}
        onAdd={handleAddItinerary}
        onRemove={handleRemoveItinerary}
        onChange={handleItineraryChange}
      />

      <MissionExperienceImagesSection
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
              ? "Actualizar experiencia"
              : "Crear experiencia"}
        </Button>
      </div>
    </form>
  );
}