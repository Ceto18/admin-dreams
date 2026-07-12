// src/modules/people/components/form/personFormUtils.ts

import type {
  Person,
  PersonImage,
  PersonMissionPayload,
} from "../../types";

export const ROLE_OPTIONS = [
  {
    value: "influencer",
    label: "Influencers",
  },
  {
    value: "coordinador",
    label: "Coordinadores",
  },
  {
    value: "colaborador",
    label: "Colaboradores",
  },
];

export function getInitialLanguageUuids(person: Person) {
  const languages = person.languages ?? [];

  return languages
    .map((language) => {
      if (typeof language === "string") {
        return language;
      }

      return language.uuid;
    })
    .filter(Boolean);
}

export function getInitialMissions(person: Person): PersonMissionPayload[] {
  const missionPeople = person.mission_people ?? [];

  if (missionPeople.length > 0) {
    return missionPeople.map((missionPerson) => ({
      mission_uuid: missionPerson.mission?.uuid ?? "",
      role: missionPerson.role ?? "",
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
    role: mission.role ?? mission.pivot?.role ?? "",
  }));
}

export function getPersonGalleryImageUrl(image: string | PersonImage) {
  if (typeof image === "string") {
    return image;
  }

  return image.image_url || image.url || image.path || "";
}

export function getCurrentPersonPhoto(person: Person | null) {
  if (!person) return "";

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