import { BloodType } from '../../domain/enum/boodtype.enum';
import { GenderType } from '../../domain/enum/Gender-type.enum';

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
  gender: GenderType;
  bloodType: BloodType;
  weight: number;
  createdAt: Date;
  age: number;
  eligible: boolean;
  lastDonation?: Date | null;
  registrationDate: Date;
  nextDonationDate?: Date | null;
  donationHistory?: DonationHistory[] | null;
}
