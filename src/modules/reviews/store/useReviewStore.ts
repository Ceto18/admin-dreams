// src/modules/reviews/store/useReviewStore.ts

import { create } from "zustand";

import { reviewService } from "../services/reviewService";

import type {
  Review,
  UpdateReviewPayload,
} from "../types";

import { showSuccess } from "@/shared/utils/toast";
import { handleApiError } from "@/shared/utils/handleApiError";

type FetchReviewsParams = {
  page?: number;
  perPage?: number;
  search?: string;
};

type ReviewStore = {
  reviews: Review[];
  selectedReview: Review | null;

  currentPage: number;
  totalPages: number;
  perPage: number;
  total: number;

  loading: boolean;
  loadingDetail: boolean;
  updating: boolean;
  deletingVideo: boolean;

  fetchReviews: (
    params?: FetchReviewsParams
  ) => Promise<void>;

  fetchReview: (
    reviewUuid: string
  ) => Promise<void>;

  updateReview: (
    reviewUuid: string,
    payload: UpdateReviewPayload
  ) => Promise<Review>;

  deleteReviewVideo: (
    reviewUuid: string
  ) => Promise<void>;

  clearSelectedReview: () => void;
  clearReviews: () => void;
};

export const useReviewStore = create<ReviewStore>(
  (set, get) => ({
    reviews: [],
    selectedReview: null,

    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,

    loading: false,
    loadingDetail: false,
    updating: false,
    deletingVideo: false,

    fetchReviews: async (params = {}) => {
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

        const response =
          await reviewService.getReviews({
            page,
            per_page: perPage,
            search,
          });

        const pagination = response?.data;

        set({
          reviews:
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
          "Error fetchReviews:",
          error
        );

        handleApiError(error);
      } finally {
        set({
          loading: false,
        });
      }
    },

    fetchReview: async (
      reviewUuid
    ) => {
      try {
        set({
          loadingDetail: true,
          selectedReview: null,
        });

        const response =
          await reviewService.getReview(
            reviewUuid
          );

        set({
          selectedReview:
            response?.data ?? null,
        });
      } catch (error) {
        console.error(
          "Error fetchReview:",
          error
        );

        handleApiError(error);
      } finally {
        set({
          loadingDetail: false,
        });
      }
    },

    updateReview: async (
      reviewUuid,
      payload
    ) => {
      try {
        set({
          updating: true,
        });

        const response =
          await reviewService.updateReview(
            reviewUuid,
            payload
          );

        showSuccess(
          response?.message ??
            "Reseña actualizada correctamente."
        );

        const updatedReview =
          response?.data;

        if (!updatedReview) {
          throw new Error(
            "El servidor no devolvió la reseña actualizada."
          );
        }

        set((store) => ({
          selectedReview:
            store.selectedReview?.uuid ===
            reviewUuid
              ? {
                  ...store.selectedReview,
                  ...updatedReview,
                }
              : store.selectedReview,

          reviews: store.reviews.map(
            (review) =>
              review.uuid === reviewUuid
                ? {
                    ...review,
                    ...updatedReview,
                  }
                : review
          ),
        }));

        return updatedReview;
      } catch (error) {
        console.error(
          "Error updateReview:",
          error
        );

        handleApiError(error);
        throw error;
      } finally {
        set({
          updating: false,
        });
      }
    },

    deleteReviewVideo: async (
      reviewUuid
    ) => {
      try {
        set({
          deletingVideo: true,
        });

        const response =
          await reviewService.deleteReviewVideo(
            reviewUuid
          );

        showSuccess(
          response?.message ??
            "Video eliminado correctamente."
        );

        set((store) => ({
          selectedReview:
            store.selectedReview?.uuid ===
            reviewUuid
              ? {
                  ...store.selectedReview,
                  video_url: null,
                }
              : store.selectedReview,

          reviews: store.reviews.map(
            (review) =>
              review.uuid === reviewUuid
                ? {
                    ...review,
                    video_url: null,
                  }
                : review
          ),
        }));
      } catch (error) {
        console.error(
          "Error deleteReviewVideo:",
          error
        );

        handleApiError(error);
        throw error;
      } finally {
        set({
          deletingVideo: false,
        });
      }
    },

    clearSelectedReview: () => {
      set({
        selectedReview: null,
      });
    },

    clearReviews: () => {
      set({
        reviews: [],
        currentPage: 1,
        totalPages: 1,
        total: 0,
      });
    },
  })
);