// src/modules/reviews/types/index.ts

export type ReviewState = "approved" | "pending" | "denied";

export type Review = {
  uuid: string;
  name: string;
  rating: number;

  /**
   * Campo usado en el listado actual.
   */
  is_approved: boolean;

  /**
   * Campos disponibles en el endpoint de detalle.
   */
  comment?: string | null;
  video_url?: string | null;
  moment_name?: string | null;
  experience_name?: string | null;
  mission_name?: string | null;

  /**
   * Puede venir en el detalle después de implementar
   * los estados approved, pending y denied.
   */
  state?: ReviewState;
};

export type GetReviewsParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type UpdateReviewPayload = {
  comment: string;
  rating: number;
  state: ReviewState;
};

export type ReviewsPagination = {
  current_page: number;
  data: Review[];
  first_page_url?: string;
  from?: number | null;
  last_page: number;
  last_page_url?: string;
  links?: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
  next_page_url?: string | null;
  path?: string;
  per_page: number;
  prev_page_url?: string | null;
  to?: number | null;
  total: number;
};

export type ReviewsResponse = {
  success: boolean;
  message: string;
  data: ReviewsPagination;
};

export type ReviewResponse = {
  success: boolean;
  message: string;
  data: Review;
};

export type UpdateReviewResponse = {
  success: boolean;
  message: string;
  data: Review;
};

export type DeleteReviewVideoResponse = {
  success: boolean;
  message: string;
  data?: Review | null;
};