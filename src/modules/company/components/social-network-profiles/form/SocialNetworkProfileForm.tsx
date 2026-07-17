// src/modules/company/components/social-network-profile/form/SocialNetworkProfileForm.tsx

"use client";

import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import Button from "@/shared/components/ui/button/Button";

import type {
  SocialNetwork,
  SocialNetworkProfile,
  SocialNetworkProfileField,
  SocialNetworkProfileFormState,
  SocialNetworkProfilePayload,
} from "../../../types";

import SocialNetworkProfileInfoSection from "./SocialNetworkProfileInfoSection";

interface Props {
  initialData?: SocialNetworkProfile | null;

  socialNetworks: SocialNetwork[];

  loading?: boolean;
  loadingSocialNetworks?: boolean;

  onSubmit: (
    payload: SocialNetworkProfilePayload
  ) => Promise<void> | void;
}

const initialState: SocialNetworkProfileFormState = {
  social_network_uuid: "",
  nickname: "",
  url: "",
  label: "",
};

const profileFields: SocialNetworkProfileField[] = [
  {
    name: "nickname",
    label: "Nombre o usuario",
    type: "text",
    placeholder: "Ej: YouTube Dreams",
    maxLength: 255,
  },
  {
    name: "url",
    label: "URL del perfil",
    type: "url",
    placeholder:
      "Ej: https://youtube.com/usuario",
    maxLength: 500,
    fullWidth: true,
  },
];

export default function SocialNetworkProfileForm({
  initialData = null,
  socialNetworks,
  loading = false,
  loadingSocialNetworks = false,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<SocialNetworkProfileFormState>(
      initialState
    );

  useEffect(() => {
    if (!initialData) {
      setForm(initialState);
      return;
    }

    setForm({
      social_network_uuid:
        initialData.social_network_uuid ??
        initialData.social_network?.uuid ??
        "",
      nickname: initialData.nickname ?? "",
      url: initialData.url ?? "",
      label: normalizeProfileLabel(
        initialData.label
      ),
    });
  }, [initialData]);

  const handleChange = (
    field: keyof SocialNetworkProfileFormState,
    value: string
  ) => {
    if (field === "label") {
      setForm((previousForm) => ({
        ...previousForm,
        label: normalizeProfileLabel(value),
      }));

      return;
    }

    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const socialNetworkUuid =
      form.social_network_uuid.trim();

    const nickname = form.nickname.trim();
    const url = form.url.trim();

    if (!socialNetworkUuid) return;
    if (!nickname) return;
    if (!url) return;

    if (
      form.label !== "Principal" &&
      form.label !== "Secundario"
    ) {
      return;
    }

    if (!isValidUrl(url)) {
      return;
    }

    await onSubmit({
      social_network_uuid:
        socialNetworkUuid,
      nickname,
      url,
      label: form.label,
    });
  };

  const isFormInvalid =
    !form.social_network_uuid.trim() ||
    !form.nickname.trim() ||
    !form.url.trim() ||
    !form.label;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <SocialNetworkProfileInfoSection
        form={form}
        fields={profileFields}
        socialNetworks={socialNetworks}
        loadingSocialNetworks={
          loadingSocialNetworks
        }
        onChange={handleChange}
      />

      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          disabled={
            loading ||
            loadingSocialNetworks ||
            isFormInvalid
          }
        >
          {loading
            ? "Guardando..."
            : initialData
              ? "Actualizar perfil"
              : "Crear perfil"}
        </Button>
      </div>
    </form>
  );
}

function normalizeProfileLabel(
  value?: string | null
): SocialNetworkProfileFormState["label"] {
  if (value === "Principal") {
    return "Principal";
  }

  if (value === "Secundario") {
    return "Secundario";
  }

  return "";
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}