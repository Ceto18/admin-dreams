// src/modules/people/services/personService.ts

import { api } from "@/services/api";

import type {
  PersonPayload,
  GetPeopleParams,
  GetLanguagesParams,
  LanguagesResponse,
  DeletePersonImageResponse,
  UpdatePersonStatePayload,
  UpdatePersonStateResponse,
} from "../types";

const buildPersonFormData = (payload: PersonPayload) => {
  const formData = new FormData();

  formData.append("first_name", payload.first_name);
  formData.append("last_name", payload.last_name);
  formData.append("experience", payload.experience);
  formData.append("specialty", payload.specialty);
  formData.append("bio", payload.bio);

  if (payload.photo_perfil) {
    formData.append("photo_perfil", payload.photo_perfil);
  }

  payload.missions.forEach((mission, index) => {
    formData.append(
      `missions[${index}][mission_uuid]`,
      mission.mission_uuid
    );

    formData.append(
      `missions[${index}][role]`,
      mission.role
    );
  });

  payload.images?.forEach((image, index) => {
    if (image) {
      formData.append(`images[${index}]`, image);
    }
  });

  payload.languages?.forEach((languageUuid, index) => {
    formData.append(
      `languages[${index}]`,
      languageUuid
    );
  });

  return formData;
};

export const personService = {
  getPeople: async (
    params: GetPeopleParams = {}
  ) => {
    const res = await api.get("/admin/people", {
      params,
    });

    return res.data;
  },

  getPerson: async (uuid: string) => {
    const res = await api.get(
      `/admin/people/${uuid}`
    );

    return res.data;
  },

  createPerson: async (
    payload: PersonPayload
  ) => {
    const formData =
      buildPersonFormData(payload);

    const res = await api.post(
      "/admin/people",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  },

  updatePerson: async (
    uuid: string,
    payload: PersonPayload
  ) => {
    const formData =
      buildPersonFormData(payload);

    const res = await api.post(
      `/admin/people/${uuid}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  },

  deletePerson: async (uuid: string) => {
    const res = await api.delete(
      `/admin/people/${uuid}`
    );

    return res.data;
  },

  deletePersonImage: async (
    personUuid: string,
    imageUuid: string
  ): Promise<DeletePersonImageResponse> => {
    const res = await api.delete(
      `/admin/people/${personUuid}/image/${imageUuid}`
    );

    return res.data;
  },

  updatePersonState: async (
    personUuid: string,
    payload: UpdatePersonStatePayload
  ): Promise<UpdatePersonStateResponse> => {
    const res = await api.put(
      `/admin/people/${personUuid}/state`,
      payload
    );

    return res.data;
  },

  getLanguages: async (
    params: GetLanguagesParams = {}
  ): Promise<LanguagesResponse> => {
    const res = await api.get(
      "/admin/languages",
      {
        params,
      }
    );

    return res.data;
  },
};
