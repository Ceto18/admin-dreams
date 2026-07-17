// src/modules/company/store/useCompanyStore.ts

import { create } from "zustand";

import { companyService } from "../services/companyService";

import type {
  Company,
  CompanyPayload,
} from "../types";

import { showSuccess } from "@/shared/utils/toast";
import { handleApiError } from "@/shared/utils/handleApiError";

interface CompanyState {
  company: Company | null;

  loading: boolean;
  updating: boolean;

  fetchCompany: () => Promise<void>;

  updateCompany: (
    payload: CompanyPayload
  ) => Promise<void>;

  clearCompany: () => void;
}

export const useCompanyStore = create<CompanyState>(
  (set) => ({
    company: null,

    loading: false,
    updating: false,

    fetchCompany: async () => {
      try {
        set({
          loading: true,
          company: null,
        });

        const response =
          await companyService.getCompany();

        set({
          company: response.data,
        });
      } catch (error) {
        console.error(
          "Error fetchCompany:",
          error
        );

        handleApiError(error);
      } finally {
        set({
          loading: false,
        });
      }
    },

    updateCompany: async (payload) => {
      try {
        set({
          updating: true,
        });

        const response =
          await companyService.updateCompany(
            payload
          );

        showSuccess(
          response.message ??
            "Información de la empresa actualizada correctamente."
        );

        set({
          company: response.data,
        });
      } catch (error) {
        console.error(
          "Error updateCompany:",
          error
        );

        handleApiError(error);
        throw error;
      } finally {
        set({
          updating: false,
        });
      }
    },

    clearCompany: () => {
      set({
        company: null,
      });
    },
  })
);