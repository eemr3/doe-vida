export interface DonationRecord {
  date: string;
  location: string;
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
  lastDonation: string | null;
  registrationDate: string;
  eligible: boolean;
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
  weight: string;
  city: string;
  lastDonation: string;
  /** Local da última doação (opcional). Usado quando lastDonation é informada. */
  lastDonationLocation: string;
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
  eligible: boolean;
  /** Data da última doação (ISO). Null se nunca doou. */
  lastDonation?: string | null;
  /** Data de cadastro (ISO). */
  registeredAt?: string;
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
  city: string;
  bloodType: number;
  weight: number;
  /** Opcional. Data da última doação (ISO). Quando informada, a API cria um registro em Donations. */
  dateOfLastDonation?: string;
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
  eligible: boolean;
  registeredAt: string; // ISO
  lastDonation: string | null; // ISO
  nextDonationDate: string | null; // ISO
  donationHistory: { date: string; location: string }[];
}