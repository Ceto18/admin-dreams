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
  subtitle: string;
  long_description: string;
  investment: string | number;
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
  subtitle: string;
  long_description: string;
  investment: string | number;
  images?: File[];
};