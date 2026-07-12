// src/modules/people/components/PersonTable.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "antd";
import Image from "next/image";

import Badge from "@/shared/components/ui/badge/Badge";
import DataTable, {
  DataTableColumn,
} from "@/shared/components/table/DataTable";

import type { Person, PersonLanguage } from "../types";

interface Props {
  data: Person[];
  loading?: boolean;

  onView?: (person: Person) => void;
  onEdit?: (person: Person) => void;
  onDelete?: (person: Person) => void;
  onToggleState?: (person: Person, state: boolean) => Promise<void> | void;

  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

export default function PersonTable({
  data,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onToggleState,
  showView = true,
  showEdit = true,
  showDelete = true,
}: Props) {
  const router = useRouter();

  const [updatingPersonUuid, setUpdatingPersonUuid] = useState<string | null>(
    null
  );

  const handleToggleState = async (person: Person, state: boolean) => {
    if (!onToggleState) return;

    try {
      setUpdatingPersonUuid(person.uuid);

      await onToggleState(person, state);
    } finally {
      setUpdatingPersonUuid(null);
    }
  };

  const handleView = (person: Person) => {
    if (onView) {
      onView(person);
      return;
    }

    router.push(`/people/${person.uuid}`);
  };

  const handleEdit = (person: Person) => {
    if (onEdit) {
      onEdit(person);
      return;
    }

    router.push(`/people/${person.uuid}/edit`);
  };

  const columns: DataTableColumn<Person>[] = [
    {
      key: "photo_perfil",
      header: "Foto",
      render: (person) => {
        const imageUrl = getPersonImageUrl(person);

        return imageUrl ? (
          <div className="relative h-14 w-14 overflow-hidden rounded-full border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <Image
              src={imageUrl}
              alt={getPersonFullName(person) || "Foto de persona"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-400 dark:border-gray-700 dark:bg-gray-900">
            Sin foto
          </div>
        );
      },
    },
    {
      key: "full_name",
      header: "Persona",
      render: (person) => {
        const fullName = getPersonFullName(person);

        return (
          <div>
            <p className="font-medium text-gray-800 dark:text-white/90">
              {fullName || "-"}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {person.specialty || "Sin especialidad"}
            </p>
          </div>
        );
      },
    },
    {
      key: "experience",
      header: "Experiencia",
      render: (person) => (
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {person.experience || "-"}
        </span>
      ),
    },
    {
      key: "missions",
      header: "Misiones",
      render: (person) => {
        const missions = getPersonMissions(person);

        if (missions.length === 0) {
          return (
            <Badge size="sm" color="light">
              Sin misiones
            </Badge>
          );
        }

        return (
          <div className="flex flex-wrap gap-2">
            {missions.slice(0, 2).map((mission, index) => (
              <Badge key={`${mission.uuid}-${index}`} size="sm" color="info">
                {mission.name || "Misión"}
              </Badge>
            ))}

            {missions.length > 2 && (
              <Badge size="sm" color="light">
                +{missions.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: "roles",
      header: "Rol",
      render: (person) => {
        const missions = getPersonMissions(person);
        const roles = missions
          .map((mission) => mission.role)
          .filter(Boolean) as string[];

        if (roles.length === 0) {
          return (
            <Badge size="sm" color="light">
              Sin rol
            </Badge>
          );
        }

        return (
          <div className="flex flex-wrap gap-2">
            {roles.slice(0, 2).map((role, index) => (
              <Badge key={`${role}-${index}`} size="sm" color="success">
                {getRoleLabel(role)}
              </Badge>
            ))}

            {roles.length > 2 && (
              <Badge size="sm" color="light">
                +{roles.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: "languages",
      header: "Idiomas",
      render: (person) => {
        const languages = person.languages ?? [];

        if (languages.length === 0) {
          return (
            <Badge size="sm" color="light">
              Sin idiomas
            </Badge>
          );
        }

        return (
          <div className="flex flex-wrap gap-2">
            {languages.slice(0, 2).map((language, index) => (
              <Badge
                key={`${getLanguageKey(language)}-${index}`}
                size="sm"
                color="warning"
              >
                {getLanguageLabel(language)}
              </Badge>
            ))}

            {languages.length > 2 && (
              <Badge size="sm" color="light">
                +{languages.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: "active",
      header: "Habilitado",
      render: (person) => {
        const isActive =
          person.active !== undefined
            ? Boolean(Number(person.active))
            : Boolean(Number(person.state));

        return (
          <Switch
            checked={isActive}
            loading={updatingPersonUuid === person.uuid}
            disabled={
              !onToggleState ||
              (updatingPersonUuid !== null &&
                updatingPersonUuid !== person.uuid)
            }
            onChange={(checked) => handleToggleState(person, checked)}
          />
        );
      },
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="No hay personas registradas."
      getRowKey={(person) => person.uuid}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={onDelete}
      showView={showView}
      showEdit={showEdit}
      showDelete={showDelete}
    />
  );
}

function getPersonFullName(person: Person) {
  return (
    person.full_name ||
    person.fullname ||
    `${person.first_name ?? ""} ${person.last_name ?? ""}`.trim()
  );
}

function getPersonImageUrl(person: Person) {
  if (typeof person.photo_perfil === "string") {
    return person.photo_perfil;
  }

  if (person.photo_perfil?.image_url) {
    return person.photo_perfil.image_url;
  }

  if (person.photo_perfil?.url) {
    return person.photo_perfil.url;
  }

  if (person.photo_perfil_url) {
    return person.photo_perfil_url;
  }

  if (person.photo_url) {
    return person.photo_url;
  }

  if (person.image_url) {
    return person.image_url;
  }

  return "";
}

function getPersonMissions(person: Person) {
  if (person.mission_people && person.mission_people.length > 0) {
    return person.mission_people.map((item) => ({
      uuid: item.mission?.uuid || String(item.mission_id ?? ""),
      name: item.mission?.name || "Misión",
      role: item.role || "",
    }));
  }

  if (person.missions && person.missions.length > 0) {
    return person.missions.map((mission) => ({
      uuid: mission.mission_uuid || mission.mission?.uuid || mission.uuid,
      name: mission.name || mission.label || mission.mission?.name || "Misión",
      role: mission.role || mission.pivot?.role || "",
    }));
  }

  return [];
}

function getLanguageLabel(language: string | PersonLanguage) {
  if (typeof language === "string") {
    return language;
  }

  return language.name || language.label || language.code || language.uuid;
}

function getLanguageKey(language: string | PersonLanguage) {
  if (typeof language === "string") {
    return language;
  }

  return language.uuid || language.code || language.name || "language";
}

function getRoleLabel(role: string) {
  const normalizedRole = role.toLowerCase();

  const labels: Record<string, string> = {
    influencer: "Influencers",
    coordinador: "Coordinadores",
    colaborador: "Colaboradores",
  };

  return labels[normalizedRole] || role;
}