import type { MissionExperienceDifficulty } from "../../types";

export type MissionExperienceFormState = {
  name: string;
  short_description: string;
  release_date: string;
  number_seats: string;
  seats_used: string;
  days: string;
  nights: string;
  raiting: string;
  difficulty: MissionExperienceDifficulty;
  subtitle: string;
  long_description: string;
  investment: string;
};

export type ItineraryFormState = {
  day: string;
  order: string;
  title: string;
  description: string;
};

export type ExperienceFieldOption = {
  value: MissionExperienceDifficulty;
  label: string;
};

export type ExperienceField = {
  name: keyof MissionExperienceFormState;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "date" | "select";
  step?: string | number;
  options?: ExperienceFieldOption[];
};
