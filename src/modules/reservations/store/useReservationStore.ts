// src/modules/reservations/store/useReservationStore.ts

import { create } from "zustand";

import { reservationService } from "../services/reservationService";

import type {
  Reservation,
  ReservationListItem,
  ReservationStatus,
} from "../types";

import { handleApiError } from "@/shared/utils/handleApiError";

type FetchReservationsParams = {
  page?: number;
  perPage?: number;
  search?: string;
  status?: ReservationStatus;
};

type ReservationStore = {
  reservations: ReservationListItem[];
  selectedReservation: Reservation | null;

  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;

  loading: boolean;
  loadingDetail: boolean;

  fetchReservations: (
    params?: FetchReservationsParams
  ) => Promise<void>;

  fetchReservation: (
    reservationCode: string
  ) => Promise<void>;

  clearSelectedReservation: () => void;
  clearReservations: () => void;
};

export const useReservationStore =
  create<ReservationStore>((set, get) => ({
    reservations: [],
    selectedReservation: null,

    currentPage: 1,
    totalPages: 1,
    perPage: 15,
    total: 0,

    loading: false,
    loadingDetail: false,

    fetchReservations: async (
      params = {}
    ) => {
      try {
        set({
          loading: true,
        });

        const page =
          params.page ?? get().currentPage;

        const perPage =
          params.perPage ?? get().perPage;

        const search =
          params.search ?? "";

        const status = params.status;

        const response =
          await reservationService.getReservations({
            page,
            per_page: perPage,
            search,
            status,
          });

        const pagination = response?.data;

        set({
          reservations:
            pagination?.data ?? [],

          currentPage:
            pagination?.current_page ??
            page,

          totalPages:
            pagination?.last_page ?? 1,

          perPage: Number(
            pagination?.per_page ??
              perPage
          ),

          total:
            pagination?.total ?? 0,
        });
      } catch (error) {
        console.error(
          "Error fetchReservations:",
          error
        );

        handleApiError(error);
      } finally {
        set({
          loading: false,
        });
      }
    },

    fetchReservation: async (
      reservationCode
    ) => {
      try {
        set({
          loadingDetail: true,
          selectedReservation: null,
        });

        const response =
          await reservationService.getReservation(
            reservationCode
          );

        set({
          selectedReservation:
            response?.data ?? null,
        });
      } catch (error) {
        console.error(
          "Error fetchReservation:",
          error
        );

        handleApiError(error);
      } finally {
        set({
          loadingDetail: false,
        });
      }
    },

    clearSelectedReservation: () => {
      set({
        selectedReservation: null,
      });
    },

    clearReservations: () => {
      set({
        reservations: [],
        currentPage: 1,
        totalPages: 1,
        total: 0,
      });
    },
  }));
