import { api } from "@/services/api";
import {
  MissionExperiencePayload,
  UpdateMissionExperienceStatePayload,
} from "../types";

type GetMissionExperiencesParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

const buildMissionExperienceFormData = (payload: MissionExperiencePayload) => {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("short_description", payload.short_description);
  formData.append("release_date", payload.release_date);
  formData.append("number_seats", String(payload.number_seats));
  formData.append("seats_used", String(payload.seats_used));
  formData.append("days", String(payload.days));
  formData.append("nights", String(payload.nights));
  formData.append("raiting", String(payload.raiting));
  formData.append("difficulty", payload.difficulty);
  formData.append("subtitle", payload.subtitle);
  formData.append("long_description", payload.long_description);
  formData.append("investment", String(payload.investment));

  if (payload.file_url) {
    formData.append("file", payload.file_url);
  }

  payload.images?.slice(0, 4).forEach((image, index) => {
    if (image) {
      formData.append(`images[${index}]`, image);
    }
  });

  payload.features?.forEach((feature, index) => {
    const cleanFeature = feature.trim();

    if (cleanFeature) {
      formData.append(`features[${index}]`, cleanFeature);
    }
  });

  payload.itineraries?.forEach((itinerary, index) => {
    if (itinerary.day !== "" && itinerary.title.trim()) {
      formData.append(`itineraries[${index}][day]`, String(itinerary.day));
      formData.append(`itineraries[${index}][order]`, String(itinerary.order));
      formData.append(`itineraries[${index}][title]`, itinerary.title.trim());
      formData.append(
        `itineraries[${index}][description]`,
        itinerary.description.trim()
      );
    }
  });

  return formData;
};

export const missionExperienceService = {
  getMissionExperiences: async (
    missionUuid: string,
    params: GetMissionExperiencesParams = {}
  ) => {
    const res = await api.get(`/admin/missions/${missionUuid}/experiences`, {
      params,
    });

    return res.data;
  },

  getMissionExperience: async (missionUuid: string, experienceUuid: string) => {
    const res = await api.get(
      `/admin/missions/${missionUuid}/experiences/${experienceUuid}`
    );

    return res.data;
  },

  createMissionExperience: async (
    missionUuid: string,
    payload: MissionExperiencePayload
  ) => {
    const formData = buildMissionExperienceFormData(payload);

    const res = await api.post(
      `/admin/missions/${missionUuid}/experiences`,
      formData
    );

    return res.data;
  },

  updateMissionExperience: async (
    missionUuid: string,
    experienceUuid: string,
    payload: MissionExperiencePayload
  ) => {
    const formData = buildMissionExperienceFormData(payload);

    const res = await api.post(
      `/admin/missions/${missionUuid}/experiences/${experienceUuid}`,
      formData
    );

    return res.data;
  },

  deleteMissionExperience: async (
    missionUuid: string,
    experienceUuid: string
  ) => {
    const res = await api.delete(
      `/admin/missions/${missionUuid}/experiences/${experienceUuid}`
    );

    return res.data;
  },

  deleteMissionExperienceImage: async (
    missionUuid: string,
    experienceUuid: string,
    imageUuid: string
  ) => {
    const res = await api.delete(
      `/admin/missions/${missionUuid}/experiences/${experienceUuid}/images/${imageUuid}`
    );

    return res.data;
  },

  updateMissionExperienceState: async (
    missionUuid: string,
    experienceUuid: string,
    payload: UpdateMissionExperienceStatePayload
  ) => {
    const res = await api.put(
      `/admin/missions/${missionUuid}/experiences/state/${experienceUuid}`,
      payload
    );

    return res.data;
  },
};