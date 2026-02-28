import { BloodType } from '../enum/boodtype.enum';
import { GenderType } from '../enum/Gender-type.enum';

export interface DonationHistoryItem {
  id: string;
  donorId?: string;
  dateDonation: Date;
  location: string;
}

export interface DonorListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: GenderType;
  city: string;
  bloodType: BloodType;
  weight: number;
  createdAt: Date;
  donations?: DonationHistoryItem[];
}
