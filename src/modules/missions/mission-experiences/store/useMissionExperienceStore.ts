import { create } from "zustand";

import { missionExperienceService } from "../services/missionExperienceService";
import { MissionExperience, MissionExperiencePayload } from "../types";

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
  updatingStateUuid: string | null;

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
    experienceUuid: string
  ) => Promise<void>;

  createMissionExperience: (
    missionUuid: string,
    payload: MissionExperiencePayload
  ) => Promise<void>;

  updateMissionExperience: (
    missionUuid: string,
    experienceUuid: string,
    payload: MissionExperiencePayload
  ) => Promise<void>;

  updateMissionExperienceState: (
    missionUuid: string,
    experienceUuid: string,
    state: boolean
  ) => Promise<void>;

  deleteMissionExperience: (
    missionUuid: string,
    experienceUuid: string
  ) => Promise<void>;

  deleteMissionExperienceImage: (
    missionUuid: string,
    experienceUuid: string,
    imageUuid: string
  ) => Promise<void>;

  clearExperience: () => void;
}

export const useMissionExperienceStore = create<MissionExperienceState>(
  (set, get) => ({
    experiences: [],
    experience: null,
    loading: false,
    updatingStateUuid: null,

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

    fetchMissionExperience: async (missionUuid, experienceUuid) => {
      try {
        set({ loading: true, experience: null });

        const response = await missionExperienceService.getMissionExperience(
          missionUuid,
          experienceUuid
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

        const response = await missionExperienceService.createMissionExperience(
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

    updateMissionExperience: async (missionUuid, experienceUuid, payload) => {
      try {
        set({ loading: true });

        const response = await missionExperienceService.updateMissionExperience(
          missionUuid,
          experienceUuid,
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
      const previousExperiences = get().experiences;
      const previousExperience = get().experience;

      try {
        set({
          updatingStateUuid: experienceUuid,
        });

        /*
          Actualización visual inmediata.
          Si el backend falla, se revierte en el catch.
        */
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

        const response =
          await missionExperienceService.updateMissionExperienceState(
            missionUuid,
            experienceUuid,
            {
              state,
            }
          );

        showSuccess(
          response?.message ??
            (state
              ? "Experiencia activada correctamente."
              : "Experiencia desactivada correctamente.")
        );
      } catch (error) {
        console.error("Error updateMissionExperienceState:", error);

        /*
          Si falla el API, regresamos al estado anterior.
        */
        set({
          experiences: previousExperiences,
          experience: previousExperience,
        });

        handleApiError(error);
        throw error;
      } finally {
        set({
          updatingStateUuid: null,
        });
      }
    },

    deleteMissionExperience: async (missionUuid, experienceUuid) => {
      try {
        set({ loading: true });

        const response = await missionExperienceService.deleteMissionExperience(
          missionUuid,
          experienceUuid
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

    deleteMissionExperienceImage: async (
      missionUuid,
      experienceUuid,
      imageUuid
    ) => {
      try {
        const response =
          await missionExperienceService.deleteMissionExperienceImage(
            missionUuid,
            experienceUuid,
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