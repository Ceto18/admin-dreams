// src/modules/reviews/services/reviewService.ts

import { api } from "@/services/api";

import type {
  GetReviewsParams,
  ReviewResponse,
  ReviewsResponse,
} from "../types";

export const reviewService = {
  getReviews: async (
    params: GetReviewsParams = {}
  ): Promise<ReviewsResponse> => {
    const response = await api.get("/admin/reviews", {
      params,
    });

    return response.data;
  },

  getReview: async (
    reviewUuid: string
  ): Promise<ReviewResponse> => {
    const response = await api.get(
      `/admin/reviews/${reviewUuid}`
    );

    return response.data;
  },
};