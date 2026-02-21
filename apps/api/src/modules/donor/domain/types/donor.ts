import { BloodType } from '../enum/boodtype.enum';
import { GenderType } from '../enum/Gender-type.enum';

export interface Donor {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: GenderType;
  city: string;
  bloodType: BloodType;
  weight: number;
}
