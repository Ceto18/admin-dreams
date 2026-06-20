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
    "active",
    payload.active === undefined ? "1" : String(Number(Boolean(payload.active)))
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

    const res = await api.post("/admin/missions", formData);

    return res.data;
  },

  updateMission: async (uuid: string, payload: MissionPayload) => {
    const formData = buildMissionFormData(payload);

    const res = await api.post(`/admin/missions/${uuid}`, formData);

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