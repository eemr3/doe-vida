import { Inject, Injectable } from '@nestjs/common';
import {
  DONATION_REPOSITORY,
  IDonationRepository,
} from '../../domain/repositories/donation.repository';
import { AddDonationDto } from '../dtos/add-donation.dot';
import { DonationResponseDto } from '../dtos/donation-response';
import { DonationEntity } from '../../domain/entities/donation.entiry';
import { randomUUID } from 'crypto';

@Injectable()
export class AddDonationUseCase {
  constructor(
    @Inject(DONATION_REPOSITORY)
    private readonly donationRepository: IDonationRepository,
  ) {}

  async execute(donation: AddDonationDto): Promise<DonationResponseDto> {
    const donationEntity = new DonationEntity(
      randomUUID(),
      donation.donorId,
      donation.date,
      donation.location,
    );

    return await this.donationRepository.create(donationEntity);
  }
}
