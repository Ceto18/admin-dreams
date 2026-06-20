import { create } from "zustand";
import { missionService } from "../services/missionService";
import { Mission, MissionPayload } from "../types";

import { showSuccess } from "@/shared/utils/toast";
import { handleApiError } from "@/shared/utils/handleApiError";

type FetchMissionsParams = {
  page?: number;
  perPage?: number;
  search?: string;
};

interface MissionState {
  missions: Mission[];
  mission: Mission | null;

  loading: boolean;

  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;

  fetchMissions: (params?: FetchMissionsParams) => Promise<void>;
  fetchMission: (uuid: string) => Promise<void>;
  createMission: (payload: MissionPayload) => Promise<void>;
  updateMission: (uuid: string, payload: MissionPayload) => Promise<void>;
  deleteMission: (uuid: string) => Promise<void>;
  toggleMissionState: (uuid: string, state: boolean) => Promise<void>;
  clearMission: () => void;
}

export const useMissionStore = create<MissionState>((set, get) => ({
  missions: [],
  mission: null,

  loading: false,

  currentPage: 1,
  totalPages: 1,
  perPage: 10,
  total: 0,

  fetchMissions: async (params = {}) => {
    try {
      set({ loading: true });

      const { page = 1, perPage = get().perPage, search = "" } = params;

      const response = await missionService.getMissions({
        page,
        per_page: perPage,
        search,
      });

      set({
        missions: response.data?.data ?? response.data ?? [],
        currentPage: response.data?.current_page ?? 1,
        totalPages: response.data?.last_page ?? 1,
        perPage: Number(response.data?.per_page ?? perPage),
        total: response.data?.total ?? 0,
      });
    } catch (error) {
      console.error("Error fetchMissions:", error);
      handleApiError(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchMission: async (uuid) => {
    try {
      set({
        loading: true,
        mission: null,
      });

      const response = await missionService.getMission(uuid);

      const missionData =
        response?.data?.mission ??
        response?.data ??
        response?.mission ??
        null;

      set({
        mission: missionData,
      });
    } catch (error) {
      console.error("Error fetchMission:", error);
      handleApiError(error);
    } finally {
      set({ loading: false });
    }
  },

  createMission: async (payload) => {
    try {
      set({ loading: true });

      const response = await missionService.createMission(payload);

      showSuccess(response?.message ?? "Misión creada correctamente.");
    } catch (error) {
      console.error("Error createMission:", error);
      handleApiError(error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateMission: async (uuid, payload) => {
    try {
      set({ loading: true });

      const response = await missionService.updateMission(uuid, payload);

      showSuccess(response?.message ?? "Misión actualizada correctamente.");
    } catch (error) {
      console.error("Error updateMission:", error);
      handleApiError(error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteMission: async (uuid) => {
    try {
      set({ loading: true });

      const response = await missionService.deleteMission(uuid);

      showSuccess(response?.message ?? "Misión eliminada correctamente.");

      const { currentPage, perPage } = get();

      await get().fetchMissions({
        page: currentPage,
        perPage,
      });
    } catch (error) {
      console.error("Error deleteMission:", error);
      handleApiError(error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  toggleMissionState: async (uuid, state) => {
    try {
      set({ loading: true });

      const response = await missionService.toggleMissionState(uuid, state);

      showSuccess(
        response?.message ??
          (state
            ? "Misión habilitada correctamente."
            : "Misión deshabilitada correctamente.")
      );

      set((store) => ({
        missions: store.missions.map((mission) =>
          mission.uuid === uuid ? { ...mission, active: state } : mission
        ),
        mission:
          store.mission?.uuid === uuid
            ? { ...store.mission, active: state }
            : store.mission,
      }));
    } catch (error) {
      console.error("Error toggleMissionState:", error);
      handleApiError(error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearMission: () => {
    set({
      mission: null,
    });
  },
}));