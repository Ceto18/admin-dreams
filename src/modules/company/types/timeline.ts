// src/modules/company/types/timeline.ts

export interface CompanyTimeline {
  uuid: string;
  title: string;
  description: string;
  event_date: string;
  image_url: string | null;
  active?: boolean;
}

export interface CompanyTimelinePayload {
  title: string;
  description: string;
  event_date: string;
  image?: File | null;
}