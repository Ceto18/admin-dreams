// src/modules/company-timeline/store/useCompanyTimelineStore.ts

import { create } from "zustand";

import { companyTimelineService } from "../services/companyTimelineService";

import type {
  CompanyTimeline,
  CompanyTimelinePayload,
} from "../types";

import { showSuccess } from "@/shared/utils/toast";
import { handleApiError } from "@/shared/utils/handleApiError";

type FetchCompanyTimelinesParams = {
  page?: number;
  perPage?: number;
  search?: string;
};

interface CompanyTimelineState {
  timelines: CompanyTimeline[];
  timeline: CompanyTimeline | null;

  loading: boolean;

  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;

  fetchTimelines: (
    params?: FetchCompanyTimelinesParams
  ) => Promise<void>;

  fetchTimeline: (
    uuid: string
  ) => Promise<void>;

  createTimeline: (
    payload: CompanyTimelinePayload
  ) => Promise<void>;

  updateTimeline: (
    uuid: string,
    payload: CompanyTimelinePayload
  ) => Promise<void>;

  deleteTimeline: (
    uuid: string
  ) => Promise<void>;

  toggleTimelineState: (
    uuid: string,
    state: boolean
  ) => Promise<void>;

  clearTimeline: () => void;
}

export const useCompanyTimelineStore =
  create<CompanyTimelineState>((set) => ({
    timelines: [],
    timeline: null,

    loading: false,

    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,

    fetchTimelines: async (params = {}) => {
      try {
        set({
          loading: true,
        });

        const {
          page = 1,
          perPage = 10,
          search = "",
        } = params;

        const response =
          await companyTimelineService.getTimelines({
            page,
            per_page: perPage,
            search,
          });

        set({
          timelines:
            response.data?.data ??
            response.data ??
            [],

          currentPage:
            response.data?.current_page ??
            1,

          totalPages:
            response.data?.last_page ??
            1,

          perPage: Number(
            response.data?.per_page ??
              perPage
          ),

          total:
            response.data?.total ??
            0,
        });
      } catch (error) {
        console.error(
          "Error fetchTimelines:",
          error
        );

        handleApiError(error);
      } finally {
        set({
          loading: false,
        });
      }
    },

    fetchTimeline: async (uuid) => {
      try {
        set({
          loading: true,
          timeline: null,
        });

        const response =
          await companyTimelineService.getTimeline(
            uuid
          );

        const timelineData =
          response?.data?.timeline ??
          response?.data?.data ??
          response?.data ??
          response?.timeline ??
          null;

        set({
          timeline: timelineData,
        });
      } catch (error) {
        console.error(
          "Error fetchTimeline:",
          error
        );

        handleApiError(error);
      } finally {
        set({
          loading: false,
        });
      }
    },

    createTimeline: async (payload) => {
      try {
        set({
          loading: true,
        });

        const response =
          await companyTimelineService.createTimeline(
            payload
          );

        showSuccess(
          response?.message ??
            "Etapa creada correctamente."
        );

        const createdTimeline =
          response?.data?.timeline ??
          response?.data?.data ??
          response?.data ??
          response?.timeline ??
          null;

        if (createdTimeline) {
          set((store) => ({
            timelines: [
              createdTimeline,
              ...store.timelines,
            ],
            timeline: createdTimeline,
            total: store.total + 1,
          }));
        }
      } catch (error) {
        console.error(
          "Error createTimeline:",
          error
        );

        handleApiError(error);
        throw error;
      } finally {
        set({
          loading: false,
        });
      }
    },

    updateTimeline: async (
      uuid,
      payload
    ) => {
      try {
        set({
          loading: true,
        });

        const response =
          await companyTimelineService.updateTimeline(
            uuid,
            payload
          );

        showSuccess(
          response?.message ??
            "Etapa actualizada correctamente."
        );

        const updatedTimeline =
          response?.data?.timeline ??
          response?.data?.data ??
          response?.data ??
          response?.timeline ??
          null;

        if (updatedTimeline) {
          set((store) => ({
            timeline:
              store.timeline?.uuid === uuid
                ? {
                    ...store.timeline,
                    ...updatedTimeline,
                  }
                : store.timeline,

            timelines:
              store.timelines.map(
                (timeline) =>
                  timeline.uuid === uuid
                    ? {
                        ...timeline,
                        ...updatedTimeline,
                      }
                    : timeline
              ),
          }));
        }
      } catch (error) {
        console.error(
          "Error updateTimeline:",
          error
        );

        handleApiError(error);
        throw error;
      } finally {
        set({
          loading: false,
        });
      }
    },

    deleteTimeline: async (uuid) => {
      try {
        set({
          loading: true,
        });

        const response =
          await companyTimelineService.deleteTimeline(
            uuid
          );

        showSuccess(
          response?.message ??
            "Etapa eliminada correctamente."
        );

        set((store) => ({
          timelines:
            store.timelines.filter(
              (timeline) =>
                timeline.uuid !== uuid
            ),

          timeline:
            store.timeline?.uuid === uuid
              ? null
              : store.timeline,

          total: Math.max(
            0,
            store.total - 1
          ),
        }));
      } catch (error) {
        console.error(
          "Error deleteTimeline:",
          error
        );

        handleApiError(error);
        throw error;
      } finally {
        set({
          loading: false,
        });
      }
    },

    toggleTimelineState: async (
      uuid,
      state
    ) => {
      try {
        set({
          loading: true,
        });

        const response =
          await companyTimelineService.toggleTimelineState(
            uuid,
            state
          );

        showSuccess(
          response?.message ??
            (state
              ? "Etapa habilitada correctamente."
              : "Etapa deshabilitada correctamente.")
        );

        set((store) => ({
          timelines:
            store.timelines.map(
              (timeline) =>
                timeline.uuid === uuid
                  ? {
                      ...timeline,
                      active: state,
                    }
                  : timeline
            ),

          timeline:
            store.timeline?.uuid === uuid
              ? {
                  ...store.timeline,
                  active: state,
                }
              : store.timeline,
        }));
      } catch (error) {
        console.error(
          "Error toggleTimelineState:",
          error
        );

        handleApiError(error);
        throw error;
      } finally {
        set({
          loading: false,
        });
      }
    },

    clearTimeline: () => {
      set({
        timeline: null,
      });
    },
  }));