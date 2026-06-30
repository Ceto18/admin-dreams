import { api } from "@/services/api";
import { MissionPayload } from "../types";

type GetMissionsParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

const buildMissionFormData = (payload: MissionPayload) => {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("label", payload.label);
  formData.append("country", payload.country);

  formData.append(
    "featured_on_home",
    payload.featured_on_home ? "1" : "0"
  );

  formData.append(
    "home_order",
    payload.home_order !== null && payload.home_order !== undefined
      ? String(payload.home_order)
      : ""
  );

  if (payload.image) {
    formData.append("image", payload.image);
  }

  return formData;
};

export const missionService = {
  getMissions: async (params: GetMissionsParams = {}) => {
    const res = await api.get("/admin/missions", {
      params,
    });

    return res.data;
  },

  getMission: async (uuid: string) => {
    const res = await api.get(`/admin/missions/${uuid}`);

    return res.data;
  },

  createMission: async (payload: MissionPayload) => {
    const formData = buildMissionFormData(payload);

    const res = await api.post("/admin/missions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  updateMission: async (uuid: string, payload: MissionPayload) => {
    const formData = buildMissionFormData(payload);

    const res = await api.post(`/admin/missions/${uuid}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },

  deleteMission: async (uuid: string) => {
    const res = await api.delete(`/admin/missions/${uuid}`);

    return res.data;
  },

  toggleMissionState: async (uuid: string, state: boolean) => {
    const res = await api.put(`/admin/missions/state/${uuid}`, {
      state,
    });

    return res.data;
  },
};