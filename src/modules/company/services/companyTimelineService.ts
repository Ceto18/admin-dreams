// src/modules/company-timeline/services/companyTimelineService.ts

import { api } from "@/services/api";

import type { CompanyTimelinePayload } from "../types";

type GetCompanyTimelinesParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

const buildCompanyTimelineFormData = (
  payload: CompanyTimelinePayload
) => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("event_date", payload.event_date);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  return formData;
};

export const companyTimelineService = {
  getTimelines: async (
    params: GetCompanyTimelinesParams = {}
  ) => {
    const res = await api.get(
      "/admin/company/timeline",
      {
        params,
      }
    );

    return res.data;
  },

  getTimeline: async (uuid: string) => {
    const res = await api.get(
      `/admin/company/timeline/${uuid}`
    );

    return res.data;
  },

  createTimeline: async (
    payload: CompanyTimelinePayload
  ) => {
    const formData =
      buildCompanyTimelineFormData(payload);

    const res = await api.post(
      "/admin/company/timeline",
      formData
    );

    return res.data;
  },

  updateTimeline: async (
    uuid: string,
    payload: CompanyTimelinePayload
  ) => {
    const formData =
      buildCompanyTimelineFormData(payload);

    const res = await api.post(
      `/admin/company/timeline/${uuid}`,
      formData
    );

    return res.data;
  },

  deleteTimeline: async (uuid: string) => {
    const res = await api.delete(
      `/admin/company/timeline/${uuid}`
    );

    return res.data;
  },

  toggleTimelineState: async (
    uuid: string,
    state: boolean
  ) => {
    const res = await api.put(
      `/admin/company/timeline/state/${uuid}`,
      {
        state,
      }
    );

    return res.data;
  },
};