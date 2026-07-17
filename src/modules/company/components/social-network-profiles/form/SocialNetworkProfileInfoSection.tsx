// src/modules/company/components/social-network-profile/form/
// SocialNetworkProfileInfoSection.tsx

"use client";

import Input from "@/shared/components/form/input/InputField";
import Label from "@/shared/components/form/Label";
import Select from "@/shared/components/form/Select";

import type {
  SocialNetwork,
  SocialNetworkProfileField,
  SocialNetworkProfileFormState,
} from "../../../types";

interface Props {
  form: SocialNetworkProfileFormState;
  fields: SocialNetworkProfileField[];

  socialNetworks: SocialNetwork[];
  loadingSocialNetworks?: boolean;

  onChange: (
    field: keyof SocialNetworkProfileFormState,
    value: string
  ) => void;
}

const labelOptions = [
  {
    value: "Principal",
    label: "Principal",
  },
  {
    value: "Secundario",
    label: "Secundario",
  },
];

export default function SocialNetworkProfileInfoSection({
  form,
  fields,
  socialNetworks,
  loadingSocialNetworks = false,
  onChange,
}: Props) {
  const socialNetworkOptions = socialNetworks.map(
    (socialNetwork) => ({
      value: socialNetwork.uuid,
      label: socialNetwork.name,
    })
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Información de la red social
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configura el perfil social de la empresa.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <Label>
            Red social
            <span className="ml-1 text-error-500">
              *
            </span>
          </Label>

          <Select
            options={socialNetworkOptions}
            placeholder={
              loadingSocialNetworks
                ? "Cargando redes sociales..."
                : "Selecciona una red social"
            }
            value={form.social_network_uuid}
            onChange={(value) =>
              onChange(
                "social_network_uuid",
                value
              )
            }
          />
        </div>

        <div>
          <Label>
            Etiqueta
            <span className="ml-1 text-error-500">
              *
            </span>
          </Label>

          <Select
            options={labelOptions}
            placeholder="Selecciona una etiqueta"
            value={form.label}
            onChange={(value) =>
              onChange("label", value)
            }
          />
        </div>

        {fields.map((field) => (
          <div
            key={field.name}
            className={
              field.fullWidth
                ? "md:col-span-2"
                : ""
            }
          >
            <Label htmlFor={field.name}>
              {field.label}

              <span className="ml-1 text-error-500">
                *
              </span>
            </Label>

            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              value={form[field.name]}
              placeholder={field.placeholder}
              onValueChange={(value) =>
                onChange(field.name, value)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}