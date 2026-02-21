import { BloodType } from '../../domain/enum/boodtype.enum';
import { GenderType } from '../../domain/enum/Gender-type.enum';

export interface CreateDonorDto {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: GenderType;
  city: string;
  bloodType: BloodType;
  weight: number;
  lastDonationDate?: string;
  lastDonationLocation?: string;
}
