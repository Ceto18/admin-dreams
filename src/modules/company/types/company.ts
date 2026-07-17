// src/modules/company/types/company.ts

export interface Company {
  uuid: string;
  info: string;
  subtitle: string;
  satisfied_travelers: number;
  destinations_explored: number;
  average_rating: number;
  years_of_experience: number;
}

export interface CompanyPayload {
  info: string;
  subtitle: string;
  satisfied_travelers: number;
  destinations_explored: number;
  average_rating: number;
  years_of_experience: number;
}

export interface CompanyResponse {
  success: boolean;
  message: string;
  data: Company;
}