import { ApiProperty } from '@nestjs/swagger';
import { BloodType } from '../../../domain/enum/boodtype.enum';
import { GenderType } from '../../../domain/enum/Gender-type.enum';

export class DonationHistoryItem {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: String, format: 'date-time' })
  dateDonation: Date;

  @ApiProperty()
  location: string;
}

export class DonorListItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ type: String, format: 'date-time' })
  dateOfBirth: Date;

  @ApiProperty({ enum: GenderType })
  gender: GenderType;

  @ApiProperty()
  city: string;

  @ApiProperty({ enum: BloodType })
  bloodType: BloodType;

  @ApiProperty()
  weight: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: [DonationHistoryItem] })
  donations: DonationHistoryItem[];
}

export class ResponseDonorsDto {
  @ApiProperty({ type: [DonorListItem] })
  items: DonorListItem[];

  @ApiProperty()
  totalCount: number;
}

export class EligibilityResultDto {
  @ApiProperty()
  eligible: boolean;

  @ApiProperty({ required: false, description: 'Reason for ineligibility' })
  reason?: string;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  nextDonationDate?: Date;
}

export class DonorByIdDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ type: String, format: 'date-time' })
  dateOfBirth: Date;

  @ApiProperty({ enum: GenderType })
  gender: GenderType;

  @ApiProperty()
  city: string;

  @ApiProperty({ enum: BloodType })
  bloodType: BloodType;

  @ApiProperty()
  weight: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: 'Age calculated from dateOfBirth' })
  age: number;

  @ApiProperty({
    description: 'Eligibility result',
    type: EligibilityResultDto,
  })
  eligible: EligibilityResultDto;

  @ApiProperty({ type: String, format: 'date-time', required: false })
  lastDonation?: Date | null;

  @ApiProperty({ type: String, format: 'date-time', required: false })
  nextDonationDate?: Date | null;

  @ApiProperty({ type: String, format: 'date-time' })
  registrationDate: Date;

  @ApiProperty({ type: [DonationHistoryItem], required: false })
  donationHistory?: DonationHistoryItem[] | null;
}

export class DonorStatsDto {
  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  eligibleCount: number;

  @ApiProperty()
  waitingCount: number;

  @ApiProperty()
  newThisMonthCount: number;
}
