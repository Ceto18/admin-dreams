export interface MissionMomentImage {
  uuid: string;
  name: string;
  slug: string;
  image_url: string | null;
}

export interface MissionMomentMission {
  uuid: string;
  name: string;
  image_url: string | null;
}

export interface MissionMomentExperience {
  uuid: string;
  name: string;
  file_url: string | null;
}

export interface MissionMoment {
  uuid: string;
  title: string;
  description: string;
  proverb: string;
  place: string;
  experience: string;
  ideal: string;
  sensation: string;
  slug: string;

  featured_on_home?: boolean | number | string;
  home_order?: number | null;

  mission: MissionMomentMission;
  mission_experience: MissionMomentExperience;
  images: MissionMomentImage[];
}

export interface MissionMomentPayload {
  title: string;
  description: string;
  proverb: string;
  place: string;
  experience: string;
  ideal: string;
  sensation: string;

  featured_on_home: boolean | number;
  home_order: number | null;

  /**
   * Para creación/edición con imágenes.
   * Si tu backend espera "images[]" en FormData, se manda desde el service.
   */
  images?: File[];
}

export interface MissionMomentPagination {
  current_page: number;
  data: MissionMoment[];
  last_page: number;
  per_page: number;
  total: number;
}