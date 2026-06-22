export type MissionMomentFormState = {
  title: string;
  description: string;
  proverb: string;
  place: string;
  experience: string;
  ideal: string;
  sensation: string;
};

export type MomentField = {
  name: keyof MissionMomentFormState;
  label: string;
  placeholder?: string;
  type?: string;
};