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
  ) => Promise<boolean>;

  updateMissionMoment: (
    missionUuid: string,
    experienceUuid: string,
    momentUuid: string,
    payload: MissionMomentPayload
  ) => Promise<boolean>;

  deleteMissionMoment: (
    missionUuid: string,
    experienceUuid: string,
    momentUuid: string
  ) => Promise<boolean>;

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
    perPage = 10,
    search = "",
  }) => {
    try {
      set({ loading: true });

      const data = await missionMomentService.getMissionMoments({
        missionUuid,
        experienceUuid,
        page,
        perPage,
        search,
      });

      set({
        moments: data.data,
        currentPage: data.current_page,
        totalPages: data.last_page,
        perPage: data.per_page,
        total: data.total,
      });
    } catch (error) {
      handleApiError(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchMissionMoment: async (missionUuid, experienceUuid, momentUuid) => {
    try {
      set({ loading: true });

      const moment = await missionMomentService.getMissionMoment(
        missionUuid,
        experienceUuid,
        momentUuid
      );

      set({ moment });
    } catch (error) {
      handleApiError(error);
    } finally {
      set({ loading: false });
    }
  },

  createMissionMoment: async (missionUuid, experienceUuid, payload) => {
    try {
      set({ loading: true });

      await missionMomentService.createMissionMoment(
        missionUuid,
        experienceUuid,
        payload
      );

      showSuccess("Momento creado correctamente");

      await get().fetchMissionMoments({
        missionUuid,
        experienceUuid,
        page: get().currentPage,
        perPage: get().perPage,
      });

      return true;
    } catch (error) {
      handleApiError(error);
      return false;
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

      await missionMomentService.updateMissionMoment(
        missionUuid,
        experienceUuid,
        momentUuid,
        payload
      );

      showSuccess("Momento actualizado correctamente");

      await get().fetchMissionMoments({
        missionUuid,
        experienceUuid,
        page: get().currentPage,
        perPage: get().perPage,
      });

      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteMissionMoment: async (missionUuid, experienceUuid, momentUuid) => {
    try {
      set({ loading: true });

      await missionMomentService.deleteMissionMoment(
        missionUuid,
        experienceUuid,
        momentUuid
      );

      showSuccess("Momento eliminado correctamente");

      await get().fetchMissionMoments({
        missionUuid,
        experienceUuid,
        page: get().currentPage,
        perPage: get().perPage,
      });

      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  clearMissionMoment: () => {
    set({ moment: null });
  },
}));