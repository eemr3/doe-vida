import { BloodType } from '../../domain/enum/boodtype.enum';

export interface CreateDonorDto {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  city: string;
  bloodType: BloodType;
  weight: number;
  lastDonationDate?: Date;
  lastDonationLocation?: string;
}
