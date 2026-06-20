export type MissionExperienceFormState = {
  name: string;
  short_description: string;
  release_date: string;
  number_seats: string;
  seats_used: string;
  days: string;
  nights: string;
  raiting: string;
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

export type ExperienceField = {
  name: keyof MissionExperienceFormState;
  label: string;
  placeholder?: string;
  type?: string;
  step?: string | number;
};