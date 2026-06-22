import { api } from "@/services/api";

import {
  MissionMoment,
  MissionMomentPagination,
  MissionMomentPayload,
} from "../types";

type GetMissionMomentsParams = {
  missionUuid: string;
  experienceUuid: string;
  page?: number;
  perPage?: number;
  search?: string;
};

const basePath = (missionUuid: string, experienceUuid: string) =>
  `/admin/missions/${missionUuid}/experiences/${experienceUuid}/moments`;

const buildFormData = (payload: MissionMomentPayload) => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("proverb", payload.proverb);
  formData.append("place", payload.place);
  formData.append("experience", payload.experience);
  formData.append("ideal", payload.ideal);
  formData.append("sensation", payload.sensation);

  payload.images?.forEach((image) => {
    formData.append("images[]", image);
  });

  return formData;
};

export const missionMomentService = {
  async getMissionMoments({
    missionUuid,
    experienceUuid,
    page = 1,
    perPage = 10,
    search = "",
  }: GetMissionMomentsParams) {
    const response = await api.get(basePath(missionUuid, experienceUuid), {
      params: {
        page,
        per_page: perPage,
        search: search || undefined,
      },
    });

    return response.data.data as MissionMomentPagination;
  },

  async getMissionMoment(
    missionUuid: string,
    experienceUuid: string,
    momentUuid: string
  ) {
    const response = await api.get(
      `${basePath(missionUuid, experienceUuid)}/${momentUuid}`
    );

    return response.data.data as MissionMoment;
  },

  async createMissionMoment(
    missionUuid: string,
    experienceUuid: string,
    payload: MissionMomentPayload
  ) {
    const formData = buildFormData(payload);

    const response = await api.post(
      basePath(missionUuid, experienceUuid),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data as MissionMoment;
  },

  async updateMissionMoment(
    missionUuid: string,
    experienceUuid: string,
    momentUuid: string,
    payload: MissionMomentPayload
  ) {
    const formData = buildFormData(payload);

    /**
     * Si tu backend Laravel usa PUT/PATCH con FormData,
     * normalmente conviene enviar POST + _method=PUT.
     */
    formData.append("_method", "PUT");

    const response = await api.post(
      `${basePath(missionUuid, experienceUuid)}/${momentUuid}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data as MissionMoment;
  },

  async deleteMissionMoment(
    missionUuid: string,
    experienceUuid: string,
    momentUuid: string
  ) {
    const response = await api.delete(
      `${basePath(missionUuid, experienceUuid)}/${momentUuid}`
    );

    return response.data;
  },
};