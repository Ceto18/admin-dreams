// src/modules/company/services/companyService.ts

import { api } from "@/services/api";

import type {
  CompanyPayload,
  CompanyResponse,
} from "../types";

export const companyService = {
  getCompany: async (): Promise<CompanyResponse> => {
    const res = await api.get<CompanyResponse>(
      "/admin/company"
    );

    return res.data;
  },

  updateCompany: async (
    payload: CompanyPayload
  ): Promise<CompanyResponse> => {
    const res = await api.put<CompanyResponse>(
      "/admin/company",
      payload
    );

    return res.data;
  },
};