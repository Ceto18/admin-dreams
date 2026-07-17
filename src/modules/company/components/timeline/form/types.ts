// src/modules/company/components/form/types.ts

export interface CompanyTimelineFormState {
  title: string;
  description: string;
  event_date: string;
}

export interface CompanyTimelineField {
  name: keyof CompanyTimelineFormState;
  label: string;

  type?: "text" | "number" | "date" | "textarea";

  placeholder?: string;
  maxLength?: number;
  rows?: number;

  fullWidth?: boolean;

  min?: string;
  max?: string;
  step?: string | number;
}