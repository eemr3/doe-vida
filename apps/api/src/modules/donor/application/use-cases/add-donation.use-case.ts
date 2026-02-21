import { Inject, Injectable } from '@nestjs/common';
import {
  DONATION_REPOSITORY,
  IDonationRepository,
} from '../../domain/repositories/donation.repository';
import { AddDonationDto } from '../dtos/add-donation.dot';
import { DonationResponseDto } from '../dtos/donation-response';
import { DonationEntity } from '../../domain/entities/donation.entiry';
import { randomUUID } from 'crypto';
import {
  DONOR_REPOSITORY,
  IDonorRepository,
} from '../../domain/repositories/donor.repository';
import { DonorEntity } from '../../domain/entities/donor.entity';
import { NotFoundError } from '../../../../shared/exceptions/not-found.error';

@Injectable()
export class AddDonationUseCase {
  constructor(
    @Inject(DONATION_REPOSITORY)
    private readonly donationRepository: IDonationRepository,
    @Inject(DONOR_REPOSITORY)
    private readonly donorRepository: IDonorRepository,
  ) {}

  async execute(donation: AddDonationDto): Promise<DonationResponseDto> {
    const donationEntity = new DonationEntity(
      randomUUID(),
      donation.donorId,
      donation.date,
      donation.location,
    );

    const donor = await this.donorRepository.findById(donation.donorId);
    if (!donor) {
      throw new NotFoundError('Donor not found');
    }

    donor?.donations?.push(donationEntity.dateDonation![0]);
    const createdDonation =
      await this.donationRepository.create(donationEntity);
    await this.donorRepository.update(donor);
    return createdDonation;
  }
}
