export interface DonationRecord {
  dateDonation: string;
  location: string;
}

export type IneligibilityReason =
  | 'WEIGHT_TOO_LOW'
  | 'TOO_YOUNG'
  | 'TOO_OLD'
  | 'DONATION_INTERVAL_NOT_MET';

export interface EligibilityResult {
  eligible: boolean;
  reason?: IneligibilityReason;
  nextDonationDate?: string;
}
export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  birthDate: string;
  /** Idade (vinda da API quando birthDate não está disponível) */
  age?: number;
  weight: number;
  city: string;
  lastDonation?: string;
  registrationDate: string;
  eligible: EligibilityResult;
  nextDonationDate: string | null;
  donationHistory: DonationRecord[];
}

/** Dados do formulário de cadastro de doador */
export interface DonorFormData {
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  birthDate: string;
  gender: string;
  weight: string;
  city: string;
  lastDonationDate?: string;
  /** Local da última doação (opcional). Usado quando lastDonation é informada. */
  lastDonationLocation?: string;
}

export interface DonorsApiItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  age: number;
  bloodType: number;
  weight: number;
  eligible: EligibilityResult;
  /** Data da última doação (ISO). Null se nunca doou. */
  lastDonation?: Date | null;
  /** Data de cadastro (ISO). */
  registeredAt?: string;
  nextDonationDate?: string;
  donationHistory?: { dateDonation: string; location: string }[];
}

export interface DonorsApiResponse {
  items: DonorsApiItem[];
  totalCount: number;
}

// --- Body do registro (POST /api/donors) ---
export interface RegisterDonorApiRequest {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string; // ISO
  gender: string;
  city: string;
  bloodType: number;
  weight: number;
  /** Opcional. Data da última doação (ISO). Quando informada, a API cria um registro em Donations. */
  lastDonationDate?: string;
  /** Opcional. Local da última doação. */
  lastDonationLocation?: string;
}

export interface RegisterDonorApiResponse {
  id: string;
}

// --- Resposta do detalhe (GET /api/donors/:id) ---
export interface GetDonorByIdApiResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  age: number;
  bloodType: number;
  weight: number;
  eligible: EligibilityResult;
  registeredAt: string; // ISO
  lastDonation: string; // ISO
  nextDonationDate: string | null; // ISO
  donationHistory: { dateDonation: string; location: string }[];
}

export interface DonorStatsDto {
  totalCount: number;
  eligibleCount: number;
  waitingCount: number;
  newThisMonthCount: number;
}
