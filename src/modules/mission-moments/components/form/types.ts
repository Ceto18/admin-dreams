export type MissionMomentFormState = {
  title: string;
  description: string;
  proverb: string;
  place: string;
  experience: string;
  ideal: string;
  sensation: string;

  featured_on_home: boolean;
  home_order: string;
};

export type MissionMomentTextField =
  | "title"
  | "description"
  | "proverb"
  | "place"
  | "experience"
  | "ideal"
  | "sensation";

export type MomentField = {
  name: MissionMomentTextField;
  label: string;
  placeholder?: string;
  type?: string;
};