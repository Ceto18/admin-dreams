export type HomeHeroImage = {
  name: string;
  image_url: string;
};

export type HomeHeroPayload = {
  title: string;
  highlight_text: string;
  description: string;
  destinations_count: string | number;
  travelers_count: string | number;
  experiences_count: string | number;
  continents_count: string | number;
  images?: File[];
};

export type HomePayload = {
  hero: HomeHeroPayload;
};

export type HomeHero = {
  title: string;
  highlight_text: string;
  description: string;
  destinations_count: number;
  travelers_count: number;
  experiences_count: number;
  continents_count: number;
  images?: HomeHeroImage[];
};

export type Home = {
  hero: HomeHero;
};