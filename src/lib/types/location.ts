export type VerificationStatus =
  | "approved"
  | "under_review"
  | "unverified"
  | "archived";

export interface CoreLocation {
  id: string;
  name: string;
  branch_name: string | null;
  display_name: string;
  raw_address: string;
  raw_city: string | null;
  raw_province: string | null;
  raw_landmarks: string | null;
  office_hours_text: string | null;
  contact_numbers_text: string | null;
  email: string | null;
  facebook_page: string | null;
  standard_fee_text: string | null;
  standard_fee_min: number | null;
  standard_fee_max: number | null;
  student_discount_available: boolean;
  offers_walk_in: boolean;
  offers_online: boolean;
  offers_courier: boolean;
  accepts_cash: boolean;
  accepts_gcash: boolean;
  accepts_bank_transfer: boolean;
  verification_status: VerificationStatus;
  active_latitude: number | null;
  active_longitude: number | null;
}
