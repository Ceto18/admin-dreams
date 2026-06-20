import { create } from "zustand";

import { missionExperienceService } from "../services/missionExperienceService";
import {
  MissionExperience,
  MissionExperiencePayload,
} from "../types";

import { showSuccess } from "@/shared/utils/toast";
import { handleApiError } from "@/shared/utils/handleApiError";

type FetchMissionExperiencesParams = {
  missionUuid: string;
  page?: number;
  perPage?: number;
  search?: string;
};

interface MissionExperienceState {
  experiences: MissionExperience[];
  experience: MissionExperience | null;
  loading: boolean;

  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;

  fetchMissionExperiences: (
    params: FetchMissionExperiencesParams
  ) => Promise<void>;

  fetchMissionExperience: (
    missionUuid: string,
    expeuuid: string
  ) => Promise<void>;

  createMissionExperience: (
    missionUuid: string,
    payload: MissionExperiencePayload
  ) => Promise<void>;

  updateMissionExperience: (
    missionUuid: string,
    expeuuid: string,
    payload: MissionExperiencePayload
  ) => Promise<void>;

  deleteMissionExperience: (
    missionUuid: string,
    expeuuid: string
  ) => Promise<void>;

  clearExperience: () => void;
}

export const useMissionExperienceStore = create<MissionExperienceState>(
  (set, get) => ({
    experiences: [],
    experience: null,
    loading: false,

    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,

    fetchMissionExperiences: async ({
      missionUuid,
      page = 1,
      perPage = get().perPage,
      search = "",
    }) => {
      try {
        set({ loading: true });

        const response =
          await missionExperienceService.getMissionExperiences(missionUuid, {
            page,
            per_page: perPage,
            search,
          });

        set({
          experiences: response.data?.data ?? response.data ?? [],
          currentPage: response.data?.current_page ?? 1,
          totalPages: response.data?.last_page ?? 1,
          perPage: Number(response.data?.per_page ?? perPage),
          total: response.data?.total ?? 0,
        });
      } catch (error) {
        console.error("Error fetchMissionExperiences:", error);
        handleApiError(error);
      } finally {
        set({ loading: false });
      }
    },

    fetchMissionExperience: async (missionUuid, expeuuid) => {
      try {
        set({ loading: true, experience: null });

        const response =
          await missionExperienceService.getMissionExperience(
            missionUuid,
            expeuuid
          );

        set({
          experience: response?.data ?? response?.experience ?? null,
        });
      } catch (error) {
        console.error("Error fetchMissionExperience:", error);
        handleApiError(error);
      } finally {
        set({ loading: false });
      }
    },

    createMissionExperience: async (missionUuid, payload) => {
      try {
        set({ loading: true });

        const response =
          await missionExperienceService.createMissionExperience(
            missionUuid,
            payload
          );

        showSuccess(response?.message ?? "Experiencia creada correctamente.");
      } catch (error) {
        console.error("Error createMissionExperience:", error);
        handleApiError(error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    updateMissionExperience: async (missionUuid, expeuuid, payload) => {
      try {
        set({ loading: true });

        const response =
          await missionExperienceService.updateMissionExperience(
            missionUuid,
            expeuuid,
            payload
          );

        showSuccess(
          response?.message ?? "Experiencia actualizada correctamente."
        );
      } catch (error) {
        console.error("Error updateMissionExperience:", error);
        handleApiError(error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    deleteMissionExperience: async (missionUuid, expeuuid) => {
      try {
        set({ loading: true });

        const response =
          await missionExperienceService.deleteMissionExperience(
            missionUuid,
            expeuuid
          );

        showSuccess(response?.message ?? "Experiencia eliminada correctamente.");
      } catch (error) {
        console.error("Error deleteMissionExperience:", error);
        handleApiError(error);
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    clearExperience: () => set({ experience: null }),
  })
);  