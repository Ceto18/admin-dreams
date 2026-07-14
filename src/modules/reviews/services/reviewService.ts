import { api } from "@/services/api";

import type {
  DeleteReviewVideoResponse,
  GetReviewsParams,
  ReviewResponse,
  ReviewsResponse,
  UpdateReviewPayload,
  UpdateReviewResponse,
} from "../types";

export const reviewService = {
  getReviews: async (
    params: GetReviewsParams = {}
  ): Promise<ReviewsResponse> => {
    const response = await api.get<ReviewsResponse>("/admin/reviews", {
      params,
    });

    return response.data;
  },

  getReview: async (
    reviewUuid: string
  ): Promise<ReviewResponse> => {
    const response = await api.get<ReviewResponse>(
      `/admin/reviews/${reviewUuid}`
    );

    return response.data;
  },

  updateReview: async (
    reviewUuid: string,
    payload: UpdateReviewPayload
  ): Promise<UpdateReviewResponse> => {
    const response = await api.put<UpdateReviewResponse>(
      `/admin/reviews/${reviewUuid}`,
      payload
    );

    return response.data;
  },

  deleteReviewVideo: async (
    reviewUuid: string
  ): Promise<DeleteReviewVideoResponse> => {
    const response = await api.delete<DeleteReviewVideoResponse>(
      `/admin/reviews/${reviewUuid}/video`
    );

    return response.data;
  },
};