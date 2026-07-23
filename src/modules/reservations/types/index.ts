export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "cancelled";

export type ReservationListItem = {
  reservation_code: string;
  full_name: string;
  status: ReservationStatus;
  passengers: number | null;
  experience_name: string;
};

export type Reservation = {
  reservation_code: string;
  full_name: string;
  email: string;
  phone: string;
  status: ReservationStatus;
  message: string | null;
  passengers: number | null;
  experience_name: string;
};

export type ReservationPaginationLink = {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
};

export type ReservationPagination = {
  current_page: number;
  data: ReservationListItem[];

  first_page_url: string;
  from: number | null;

  last_page: number;
  last_page_url: string;

  links: ReservationPaginationLink[];

  next_page_url: string | null;
  path: string;

  per_page: number;

  prev_page_url: string | null;
  to: number | null;
  total: number;
};

export type ReservationsResponse = {
  success: boolean;
  message: string;
  data: ReservationPagination;
};

export type ReservationResponse = {
  success: boolean;
  message: string;
  data: Reservation;
};

export type GetReservationsParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: ReservationStatus;
};