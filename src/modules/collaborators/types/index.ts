// src/modules/people/types/index.ts

export type PersonMissionPayload = {
  mission_uuid: string;
  role: string;
};

export type PersonPayload = {
  first_name: string;
  last_name: string;

  missions: PersonMissionPayload[];

  photo_perfil?: File | null;
  experience: string;
  specialty: string;
  bio: string;

  images?: File[];

  /**
   * Aquí van los UUID de los idiomas seleccionados.
   * Ejemplo:
   * languages: ["7b8801b5-0664-4f3e-9e8e-9bd87367bd63"]
   */
  languages?: string[];
};

export type PersonImage = {
  id?: number;
  uuid?: string;
  person_id?: number;
  name?: string;
  slug?: string;
  image?: string;
  url?: string;
  image_url?: string;
  path?: string;
};

export type Language = {
  id?: number;
  uuid: string;
  name: string;
  code: string;
};

export type PersonLanguage = {
  id?: number;
  uuid: string;
  name?: string;
  label?: string;
  code?: string;

  pivot?: {
    person_id?: number;
    language_id?: number;
    created_at?: string;
    updated_at?: string;
  };
};

export type PersonMission = {
  uuid: string;
  mission_uuid?: string;
  name?: string;
  label?: string;
  role?: string;

  mission?: {
    uuid?: string;
    name?: string;
    label?: string;
    slug?: string;
    image_url?: string | null;
  };

  pivot?: {
    mission_uuid?: string;
    role?: string;
  };
};

export type PersonMissionPeople = {
  id?: number;
  mission_id?: number;
  person_id?: number;
  role?: string;

  mission?: {
    uuid?: string;
    name?: string;
    slug?: string;
    image_url?: string | null;
  };
};

export type Person = {
  uuid: string;

  first_name: string;
  last_name: string;

  /**
   * En algunas respuestas puede venir como full_name
   * y en tu endpoint por UUID viene como fullname.
   */
  full_name?: string;
  fullname?: string;

  slug?: string;

  photo_perfil?: string | PersonImage | null;
  photo_perfil_url?: string | null;

  /**
   * Tu endpoint /admin/people/{personUuid} devuelve photo_url.
   */
  photo_url?: string | null;

  image_url?: string | null;

  experience?: string | null;
  specialty?: string | null;
  bio?: string | null;

  /**
   * Estructura opcional por si algún endpoint devuelve missions.
   */
  missions?: PersonMission[];

  /**
   * Tu endpoint /admin/people/{personUuid} devuelve mission_people.
   */
  mission_people?: PersonMissionPeople[];

  /**
   * Puede venir como array de strings o como objetos desde backend.
   */
  languages?: Array<string | PersonLanguage>;

  /**
   * Galería de imágenes.
   */
  images?: Array<string | PersonImage>;

  active?: boolean | number;
  state?: boolean | number;

  created_at?: string;
  updated_at?: string;
};

export type PeopleResponse = {
  success?: boolean;
  message?: string;
  data:
    | Person[]
    | {
        current_page?: number;
        data: Person[];
        last_page?: number;
        per_page?: number;
        total?: number;
      };
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type PersonResponse = {
  success?: boolean;
  message?: string;
  data: Person;
};

export type DeletePersonImageResponse = {
  success?: boolean;
  message?: string;
};

export type GetPeopleParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type GetLanguagesParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type LanguagesResponse = {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: Language[];
    first_page_url?: string;
    from?: number;
    last_page: number;
    last_page_url?: string;
    links?: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url?: string | null;
    path?: string;
    per_page: number;
    prev_page_url?: string | null;
    to?: number;
    total: number;
  };
};