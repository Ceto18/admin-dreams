import { api } from "@/services/api";
import { MissionMomentPayload } from "../types";

type GetMissionMomentsParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

const buildMissionMomentFormData = (payload: MissionMomentPayload) => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("proverb", payload.proverb);
  formData.append("place", payload.place);
  formData.append("experience", payload.experience);
  formData.append("ideal", payload.ideal);
  formData.append("sensation", payload.sensation);

  payload.images?.slice(0, 4).forEach((image, index) => {
    if (image) {
      formData.append(`images[${index}]`, image);
    }
  });

  return formData;
};

export const missionMomentService = {
  getMissionMoments: async (
    missionUuid: string,
    experienceUuid: string,
    params: GetMissionMomentsParams = {}
  ) => {
    const res = await api.get(
      `/admin/missions/${missionUuid}/experiences/${experienceUuid}/moments`,
      {
        params,
      }
    );

    return res.data;
  },

  getMissionMoment: async (
    missionUuid: string,
    experienceUuid: string,
    momentUuid: string
  ) => {
    const res = await api.get(
      `/admin/missions/${missionUuid}/experiences/${experienceUuid}/moments/${momentUuid}`
    );

    return res.data;
  },

  createMissionMoment: async (
    missionUuid: string,
    experienceUuid: string,
    payload: MissionMomentPayload
  ) => {
    const formData = buildMissionMomentFormData(payload);

    const res = await api.post(
      `/admin/missions/${missionUuid}/experiences/${experienceUuid}/moments`,
      formData
    );

    return res.data;
  },

  updateMissionMoment: async (
    missionUuid: string,
    experienceUuid: string,
    momentUuid: string,
    payload: MissionMomentPayload
  ) => {
    const formData = buildMissionMomentFormData(payload);

    const res = await api.post(
      `/admin/missions/${missionUuid}/experiences/${experienceUuid}/moments/${momentUuid}`,
      formData
    );

    return res.data;
  },

  deleteMissionMoment: async (
    missionUuid: string,
    experienceUuid: string,
    momentUuid: string
  ) => {
    const res = await api.delete(
      `/admin/missions/${missionUuid}/experiences/${experienceUuid}/moments/${momentUuid}`
    );

    return res.data;
  },

  deleteMissionMomentImage: async (
    missionUuid: string,
    experienceUuid: string,
    momentUuid: string,
    imageUuid: string
  ) => {
    const res = await api.delete(
      `/admin/missions/${missionUuid}/experiences/${experienceUuid}/moments/${momentUuid}/images/${imageUuid}`
    );

    return res.data;
  },
};