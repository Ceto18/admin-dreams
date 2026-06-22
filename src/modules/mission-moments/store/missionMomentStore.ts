import { create } from "zustand";

import { missionMomentService } from "../services/missionMomentService";
import { MissionMoment, MissionMomentPayload } from "../types";

import { showSuccess } from "@/shared/utils/toast";
import { handleApiError } from "@/shared/utils/handleApiError";

type FetchMissionMomentsParams = {
  missionUuid: string;
  experienceUuid: string;
  page?: number;
  perPage?: number;
  search?: string;
};

interface MissionMomentState {
  moments: MissionMoment[];
  moment: MissionMoment | null;
  loading: boolean;

  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;

  fetchMissionMoments: (
    params: FetchMissionMomentsParams
  ) => Promise<void>;

  fetchMissionMoment: (
    missionUuid: string,
    experienceUuid: string,
    momentUuid: string
  ) => Promise<void>;

  createMissionMoment: (
    missionUuid: string,
    experienceUuid: string,
    payload: MissionMomentPayload
  ) => Promise<void>;

  updateMissionMoment: (
    missionUuid: string,
    experienceUuid: string,
    momentUuid: string,
    payload: MissionMomentPayload
  ) => Promise<void>;

  deleteMissionMoment: (
    missionUuid: string,
    experienceUuid: string,
    momentUuid: string
  ) => Promise<void>;

  deleteMissionMomentImage: (
    missionUuid: string,
    experienceUuid: string,
    momentUuid: string,
    imageUuid: string
  ) => Promise<void>;

  clearMissionMoment: () => void;
}

export const useMissionMomentStore = create<MissionMomentState>((set, get) => ({
  moments: [],
  moment: null,
  loading: false,

  currentPage: 1,
  totalPages: 1,
  perPage: 10,
  total: 0,

  fetchMissionMoments: async ({
    missionUuid,
    experienceUuid,
    page = 1,
    perPage = get().perPage,
    search = "",
  }) => {
    try {
      set({ loading: true });

      const response = await missionMomentService.getMissionMoments(
        missionUuid,
        experienceUuid,
        {
          page,
          per_page: perPage,
          search,
        }
      );

      const pagination = response?.data;

      set({
        moments: pagination?.data ?? [],
        currentPage: pagination?.current_page ?? 1,
        totalPages: pagination?.last_page ?? 1,
        perPage: Number(pagination?.per_page ?? perPage),
        total: pagination?.total ?? 0,
      });
    } catch (error) {
      console.error("Error fetchMissionMoments:", error);
      handleApiError(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchMissionMoment: async (missionUuid, experienceUuid, momentUuid) => {
    try {
      set({ loading: true, moment: null });

      const response = await missionMomentService.getMissionMoment(
        missionUuid,
        experienceUuid,
        momentUuid
      );

      set({
        moment: response?.data ?? null,
      });
    } catch (error) {
      console.error("Error fetchMissionMoment:", error);
      handleApiError(error);
    } finally {
      set({ loading: false });
    }
  },

  createMissionMoment: async (missionUuid, experienceUuid, payload) => {
    try {
      set({ loading: true });

      const response = await missionMomentService.createMissionMoment(
        missionUuid,
        experienceUuid,
        payload
      );

      showSuccess(response?.message ?? "Momento creado correctamente.");
    } catch (error) {
      console.error("Error createMissionMoment:", error);
      handleApiError(error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateMissionMoment: async (
    missionUuid,
    experienceUuid,
    momentUuid,
    payload
  ) => {
    try {
      set({ loading: true });

      const response = await missionMomentService.updateMissionMoment(
        missionUuid,
        experienceUuid,
        momentUuid,
        payload
      );

      showSuccess(response?.message ?? "Momento actualizado correctamente.");
    } catch (error) {
      console.error("Error updateMissionMoment:", error);
      handleApiError(error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteMissionMoment: async (missionUuid, experienceUuid, momentUuid) => {
    try {
      set({ loading: true });

      const response = await missionMomentService.deleteMissionMoment(
        missionUuid,
        experienceUuid,
        momentUuid
      );

      showSuccess(response?.message ?? "Momento eliminado correctamente.");
    } catch (error) {
      console.error("Error deleteMissionMoment:", error);
      handleApiError(error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteMissionMomentImage: async (
    missionUuid,
    experienceUuid,
    momentUuid,
    imageUuid
  ) => {
    try {
      const response = await missionMomentService.deleteMissionMomentImage(
        missionUuid,
        experienceUuid,
        momentUuid,
        imageUuid
      );

      showSuccess(response?.message ?? "Imagen eliminada correctamente.");

      set((state) => ({
        moment: state.moment
          ? {
              ...state.moment,
              images: state.moment.images?.filter(
                (image) => image.uuid !== imageUuid
              ),
            }
          : state.moment,

        moments: state.moments.map((moment) =>
          moment.uuid === momentUuid
            ? {
                ...moment,
                images: moment.images?.filter(
                  (image) => image.uuid !== imageUuid
                ),
              }
            : moment
        ),
      }));
    } catch (error) {
      console.error("Error deleteMissionMomentImage:", error);
      handleApiError(error);
      throw error;
    }
  },

  clearMissionMoment: () => set({ moment: null }),
}));