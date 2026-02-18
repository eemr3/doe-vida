import { DonationResponseDto } from '../../../application/dtos/donation-response';
import { BloodType } from '../../../domain/enum/boodtype.enum';

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
  donations: DonationResponseDto[];
}

export interface ResponseDonorsDto {
  items: Item[];
  totalCount: number;
}
