import { api } from "@/services/api";

import type {
  GetReservationsParams,
  ReservationResponse,
  ReservationsResponse,
} from "../types";

export const reservationService = {
  getReservations: async (
    params: GetReservationsParams = {}
  ): Promise<ReservationsResponse> => {
    const response = await api.get<ReservationsResponse>(
      "/admin/reservations",
      {
        params,
      }
    );

    return response.data;
  },

  getReservation: async (
    reservationCode: string
  ): Promise<ReservationResponse> => {
    const response = await api.get<ReservationResponse>(
      `/admin/reservations/${encodeURIComponent(reservationCode)}`
    );

    return response.data;
  },
};