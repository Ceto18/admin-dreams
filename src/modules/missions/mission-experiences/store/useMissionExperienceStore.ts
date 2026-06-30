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

  fetchAllMissionExperiencesForSelect: (
    missionUuid: string
  ) => Promise<MissionExperience[]>;

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

  updateMissionExperienceState: (
    missionUuid: string,
    experienceUuid: string,
    state: boolean
  ) => Promise<void>;

  deleteMissionExperience: (
    missionUuid: string,
    expeuuid: string
  ) => Promise<void>;

  deleteMissionExperienceImage: (
    missionUuid: string,
    expeuuid: string,
    imageUuid: string
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

        const pagination = response?.data;

        set({
          experiences: pagination?.data ?? [],
          currentPage: pagination?.current_page ?? 1,
          totalPages: pagination?.last_page ?? 1,
          perPage: Number(pagination?.per_page ?? perPage),
          total: pagination?.total ?? 0,
        });
      } catch (error) {
        console.error("Error fetchMissionExperiences:", error);
        handleApiError(error);
      } finally {
        set({ loading: false });
      }
    },

    fetchAllMissionExperiencesForSelect: async (missionUuid) => {
      try {
        set({ loading: true });

        const perPage = get().perPage;
        let page = 1;
        let lastPage = 1;
        const allExperiences: MissionExperience[] = [];

        do {
          const response =
            await missionExperienceService.getMissionExperiences(missionUuid, {
              page,
              per_page: perPage,
              search: "",
            });

          const pagination = response?.data;

          allExperiences.push(...(pagination?.data ?? []));

          lastPage = Number(pagination?.last_page ?? 1);
          page += 1;
        } while (page <= lastPage);

        return allExperiences;
      } catch (error) {
        console.error("Error fetchAllMissionExperiencesForSelect:", error);
        handleApiError(error);
        return [];
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
          experience: response?.data ?? null,
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

    updateMissionExperienceState: async (
      missionUuid,
      experienceUuid,
      state
    ) => {
      try {
        set({ loading: true });

        const response =
          await missionExperienceService.updateMissionExperienceState(
            missionUuid,
            experienceUuid,
            { state }
          );

        set((store) => ({
          experiences: store.experiences.map((experience) =>
            experience.uuid === experienceUuid
              ? {
                  ...experience,
                  state,
                }
              : experience
          ),
          experience:
            store.experience?.uuid === experienceUuid
              ? {
                  ...store.experience,
                  state,
                }
              : store.experience,
        }));

        showSuccess(
          response?.message ??
            (state
              ? "Experiencia activada correctamente."
              : "Experiencia desactivada correctamente.")
        );
      } catch (error) {
        console.error("Error updateMissionExperienceState:", error);
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

    deleteMissionExperienceImage: async (missionUuid, expeuuid, imageUuid) => {
      try {
        const response =
          await missionExperienceService.deleteMissionExperienceImage(
            missionUuid,
            expeuuid,
            imageUuid
          );

        showSuccess(response?.message ?? "Imagen eliminada correctamente.");

        set((store) => ({
          experience: store.experience
            ? {
                ...store.experience,
                images: store.experience.images?.filter(
                  (image) => image.uuid !== imageUuid
                ),
              }
            : store.experience,
        }));
      } catch (error) {
        console.error("Error deleteMissionExperienceImage:", error);
        handleApiError(error);
        throw error;
      }
    },

    clearExperience: () => set({ experience: null }),
  })
);