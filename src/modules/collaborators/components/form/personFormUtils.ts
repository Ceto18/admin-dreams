// src/modules/people/components/form/personFormUtils.ts

import type {
  Person,
  PersonImage,
  PersonMissionRole,
} from "../../types";

export type PersonMissionFormState = {
  mission_uuid: string;
  role: PersonMissionRole | "";
};

export const ROLE_OPTIONS: Array<{
  value: PersonMissionRole;
  label: string;
}> = [
  {
    value: "influencer",
    label: "Influencer",
  },
  {
    value: "coordinator",
    label: "Coordinador",
  },
  {
    value: "contributor",
    label: "Colaborador",
  },
];

export function getInitialLanguageUuids(person: Person): string[] {
  const languages = person.languages ?? [];

  return languages
    .map((language) => {
      if (typeof language === "string") {
        return language;
      }

      return language.uuid;
    })
    .filter((uuid): uuid is string => Boolean(uuid));
}

export function getInitialMissions(
  person: Person
): PersonMissionFormState[] {
  const missionPeople = person.mission_people ?? [];

  if (missionPeople.length > 0) {
    return missionPeople.map((missionPerson) => ({
      mission_uuid: missionPerson.mission?.uuid ?? "",
      role: normalizePersonMissionRole(missionPerson.role),
    }));
  }

  const missions = person.missions ?? [];

  if (missions.length === 0) {
    return [
      {
        mission_uuid: "",
        role: "",
      },
    ];
  }

  return missions.map((mission) => ({
    mission_uuid:
      mission.mission_uuid ??
      mission.mission?.uuid ??
      mission.pivot?.mission_uuid ??
      mission.uuid ??
      "",

    role: normalizePersonMissionRole(
      mission.role ?? mission.pivot?.role
    ),
  }));
}

export function getPersonGalleryImageUrl(
  image: string | PersonImage
) {
  if (typeof image === "string") {
    return image;
  }

  return image.image_url || image.url || image.path || "";
}

export function getCurrentPersonPhoto(
  person: Person | null
) {
  if (!person) {
    return "";
  }

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

export function isPersonMissionRole(
  value: unknown
): value is PersonMissionRole {
  return (
    value === "influencer" ||
    value === "coordinator" ||
    value === "contributor"
  );
}

function normalizePersonMissionRole(
  role: string | null | undefined
): PersonMissionRole | "" {
  if (!role) {
    return "";
  }

  const normalizedRole = role.toLowerCase().trim();

  const legacyRoles: Record<string, PersonMissionRole> = {
    influencer: "influencer",

    coordinator: "coordinator",
    coordinador: "coordinator",
    coordinadores: "coordinator",

    contributor: "contributor",
    colaborador: "contributor",
    colaboradores: "contributor",
  };

  return legacyRoles[normalizedRole] ?? "";
}