import { BloodType } from '../../domain/enum/boodtype.enum';

interface DonationHistory {
  dateDonation: Date;
  location: string;
}

interface Item {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  city: string;
  bloodType: BloodType;
  weight: number;
  createdAt: Date;
  age: number;
  eligible: boolean;
  lastDonation?: Date | null;
  registrationDate: Date;
  donationHistory?: DonationHistory[] | null;
}

export interface DonorResponseDto {
  items: Item[];
  totalCount: number;
}

export interface DonorByIdResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  city: string;
  bloodType: BloodType;
  weight: number;
  createdAt: Date;
  age: number;
  eligible: boolean;
  lastDonation?: Date | null;
  registrationDate: Date;
  donationHistory?: DonationHistory[] | null;
}
