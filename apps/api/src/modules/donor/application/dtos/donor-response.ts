import { BloodType } from '../../domain/enum/boodtype.enum';
import { DonationResponseDto } from './donation-response';

export interface DonorResponseDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  city: string;
  bloodType: BloodType;
  weight: number;
  createdAt: Date;
  donations?: DonationResponseDto[] | null;
}
