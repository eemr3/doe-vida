import { Inject, Injectable } from '@nestjs/common';
import {
  DONOR_REPOSITORY,
  IDonorRepository,
} from '../../domain/repositories/donor.repository';
import {
  DONATION_REPOSITORY,
  IDonationRepository,
} from '../../domain/repositories/donation.repository';
import { CreateDonorDto } from '../dtos/create-donor.dto';
import { DonorResponseDto } from '../dtos/donor-response';
import { DonorMapper } from '../mappers/donor.mapper';
import { DonorEntity } from '../../domain/entities/donor.entity';
import { randomUUID } from 'crypto';
import { DonationEntity } from '../../domain/entities/donation.entiry';
import { ConflictError } from '../../../../shared/exceptions/conflict.error';

@Injectable()
export class RegisterDonorUseCase {
  constructor(
    @Inject(DONOR_REPOSITORY)
    private readonly donorRepository: IDonorRepository,
    @Inject(DONATION_REPOSITORY)
    private readonly donationRepository: IDonationRepository,
  ) {}

  async execute(donor: CreateDonorDto): Promise<DonorResponseDto> {
    const donorExists = await this.donorRepository.findByEmail(donor.email);

    if (donorExists) {
      throw new ConflictError('Donor already exists');
    }

    const donorEntiry = new DonorEntity(
      randomUUID(),
      donor.name,
      donor.email,
      donor.phone,
      donor.dateOfBirth,
      donor.city,
      donor.bloodType,
      donor.weight,
      new Date(),
    );

    if (donor.lastDonationDate && donor.lastDonationLocation) {
      const donationEntity = new DonationEntity(
        randomUUID(),
        donorEntiry.id,
        donor.lastDonationDate,
        donor.lastDonationLocation,
      );

      await this.donationRepository.create(donationEntity);
    }

    const createdDonor = await this.donorRepository.create(donorEntiry);
    return DonorMapper.toResponse(createdDonor);
  }
}
