export type MissionExperienceDifficulty =
  | "basic"
  | "intermediate"
  | "advanced";

export type MissionExperienceImage = {
  uuid: string;
  name: string;
  slug?: string;
  image_url: string;
};

export type MissionExperienceFeature = {
  uuid: string;
  feature: string;
};

export type MissionExperienceItinerary = {
  uuid: string;
  day: string | number;
  title: string;
  description: string;
  order: number;
};

export type MissionExperiencePayloadItinerary = {
  day: string | number;
  order: string | number;
  title: string;
  description: string;
};

export type MissionExperience = {
  uuid: string;
  name: string;
  slug?: string;
  short_description: string;
  release_date: string;
  number_seats: number;
  seats_used: number;
  days: number;
  nights: number;
  raiting: string | number;
  difficulty: MissionExperienceDifficulty;
  subtitle: string;
  long_description: string;
  investment: string | number;

  // El backend en la tabla devuelve "active"
  active?: boolean | number | string;

  // Lo puedes mantener si otra respuesta del backend lo usa
  state?: boolean | number | string;

  file?: string | null;
  file_url?: string | null;

  images?: MissionExperienceImage[];
  features?: MissionExperienceFeature[];
  itineraries?: MissionExperienceItinerary[];

  created_at?: string;
  updated_at?: string;
};

export type MissionExperiencePayload = {
  name: string;
  short_description: string;
  release_date: string;
  number_seats: string | number;
  seats_used: string | number;
  days: string | number;
  nights: string | number;
  raiting: string | number;
  difficulty: MissionExperienceDifficulty;
  subtitle: string;
  long_description: string;
  investment: string | number;
  file_url?: File | null;
  images?: File[];
  features?: string[];
  itineraries?: MissionExperiencePayloadItinerary[];
};

export type DeleteMissionExperienceImageParams = {
  missionUuid: string;
  expeuuid: string;
  imageUuid: string;
};

export type UpdateMissionExperienceStatePayload = {
  state: boolean;
};