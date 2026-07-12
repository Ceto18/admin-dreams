// src/modules/people/components/form/PersonForm.tsx

"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import type {
  Language,
  Person,
  PersonMissionPayload,
  PersonPayload,
} from "../../types";

import type { Mission } from "@/modules/missions/types";

import PersonInfoSection from "./PersonInfoSection";
import PersonMissionsSection from "./PersonMissionsSection";
import PersonLanguagesSection from "./PersonLanguagesSection";
import PersonProfilePhotoSection from "./PersonProfilePhotoSection";
import PersonGallerySection from "./PersonGallerySection";

import {
  getCurrentPersonPhoto,
  getInitialLanguageUuids,
  getInitialMissions,
} from "./personFormUtils";

interface Props {
  initialData?: Person | null;
  missions: Mission[];
  languages: Language[];
  loading?: boolean;
  loadingMissions?: boolean;
  loadingLanguages?: boolean;
  onSubmit: (payload: PersonPayload) => Promise<void> | void;
  onDeleteImage?: (imageUuid: string) => Promise<void> | void;
}

export type PersonFormState = {
  first_name: string;
  last_name: string;
  experience: string;
  specialty: string;
  bio: string;
  languages: string[];
  missions: PersonMissionPayload[];
};

const initialState: PersonFormState = {
  first_name: "",
  last_name: "",
  experience: "",
  specialty: "",
  bio: "",
  languages: [],
  missions: [
    {
      mission_uuid: "",
      role: "",
    },
  ],
};

export default function PersonForm({
  initialData = null,
  missions,
  languages,
  loading = false,
  loadingMissions = false,
  loadingLanguages = false,
  onSubmit,
  onDeleteImage,
}: Props) {
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const imagesInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<PersonFormState>(initialState);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const currentPhoto = useMemo(() => {
    return getCurrentPersonPhoto(initialData);
  }, [initialData]);

  useEffect(() => {
    if (!initialData) {
      setForm(initialState);
      clearSelectedPhoto();
      clearSelectedImages();
      return;
    }

    setForm({
      first_name: initialData.first_name ?? "",
      last_name: initialData.last_name ?? "",
      experience: initialData.experience ?? "",
      specialty: initialData.specialty ?? "",
      bio: initialData.bio ?? "",
      languages: getInitialLanguageUuids(initialData),
      missions: getInitialMissions(initialData),
    });

    clearSelectedPhoto();
    clearSelectedImages();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }

      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [photoPreview, imagePreviews]);

  const handleChange = (
    field: keyof Omit<PersonFormState, "missions" | "languages">,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLanguagesChange = (values: string[]) => {
    setForm((prev) => ({
      ...prev,
      languages: values,
    }));
  };

  const handleMissionChange = (
    index: number,
    field: keyof PersonMissionPayload,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      missions: prev.missions.map((mission, missionIndex) =>
        missionIndex === index
          ? {
              ...mission,
              [field]: value,
            }
          : mission
      ),
    }));
  };

  const handleAddMission = () => {
    setForm((prev) => ({
      ...prev,
      missions: [
        ...prev.missions,
        {
          mission_uuid: "",
          role: "",
        },
      ],
    }));
  };

  const handleRemoveMission = (index: number) => {
    setForm((prev) => {
      const nextMissions = prev.missions.filter(
        (_, missionIndex) => missionIndex !== index
      );

      return {
        ...prev,
        missions:
          nextMissions.length > 0
            ? nextMissions
            : [
                {
                  mission_uuid: "",
                  role: "",
                },
              ],
      };
    });
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) return;

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) return;

    imagePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleRemoveSelectedPhoto = () => {
    clearSelectedPhoto();
  };

  const handleRemoveSelectedImages = () => {
    clearSelectedImages();
  };

  function clearSelectedPhoto() {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoFile(null);
    setPhotoPreview("");

    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  }

  function clearSelectedImages() {
    imagePreviews.forEach((preview) => {
      URL.revokeObjectURL(preview);
    });

    setImageFiles([]);
    setImagePreviews([]);

    if (imagesInputRef.current) {
      imagesInputRef.current.value = "";
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validMissions = form.missions.filter(
      (mission) => mission.mission_uuid && mission.role
    );

    await onSubmit({
      first_name: form.first_name,
      last_name: form.last_name,
      experience: form.experience,
      specialty: form.specialty,
      bio: form.bio,
      missions: validMissions,
      languages: form.languages,
      photo_perfil: photoFile,
      images: imageFiles,
    });
  };

  const visiblePhoto = photoPreview || currentPhoto;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PersonInfoSection form={form} onChange={handleChange} />

      <PersonMissionsSection
        formMissions={form.missions}
        missions={missions}
        loadingMissions={loadingMissions}
        onAddMission={handleAddMission}
        onRemoveMission={handleRemoveMission}
        onMissionChange={handleMissionChange}
      />

      <PersonLanguagesSection
        languages={languages}
        selectedLanguages={form.languages}
        loadingLanguages={loadingLanguages}
        onChange={handleLanguagesChange}
      />

      <PersonProfilePhotoSection
        visiblePhoto={visiblePhoto}
        photoFile={photoFile}
        fileInputRef={photoInputRef}
        onPhotoChange={handlePhotoChange}
        onRemoveSelectedPhoto={handleRemoveSelectedPhoto}
      />

      <PersonGallerySection
        initialData={initialData}
        imagePreviews={imagePreviews}
        fileInputRef={imagesInputRef}
        loading={loading}
        onImagesChange={handleImagesChange}
        onRemoveSelectedImages={handleRemoveSelectedImages}
        onDeleteImage={onDeleteImage}
      />

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Guardando..."
            : initialData
              ? "Actualizar persona"
              : "Crear persona"}
        </button>
      </div>
    </form>
  );
}