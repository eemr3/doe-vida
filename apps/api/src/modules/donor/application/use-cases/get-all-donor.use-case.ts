import { Inject } from '@nestjs/common';
import { DonorEntity } from '../../domain/entities/donor.entity';
import {
  DONOR_REPOSITORY,
  IDonorRepository,
} from '../../domain/repositories/donor.repository';
import { DonorResponseDto } from '../dtos/donor-response';

export class GetAllDonorUseCase {
  constructor(
    @Inject(DONOR_REPOSITORY)
    private readonly donorRepository: IDonorRepository,
  ) {}

  async execute(): Promise<DonorResponseDto> {
    const donors = await this.donorRepository.findAll();
    const result = donors.items.map((donor) => {
      const donorEntity = new DonorEntity(
        donor.id,
        donor.name,
        donor.email,
        donor.phone,
        donor.dateOfBirth,
        donor.city,
        donor.bloodType,
        donor.weight,
        donor.createdAt,
        donor.donations,
      );
      const age = donorEntity.getAge();
      const eligible = donorEntity.canDonate();
      const donationHistory =
        donorEntity.donations?.map((donation) => ({
          dateDonation: donation.dateDonation!,
          location: donation.location!,
        })) ?? null;
      const lastDonation = donorEntity.donations?.[0]?.dateDonation ?? null;
      const registeredAt = donorEntity.createdAt;

      return {
        id: donorEntity.id,
        name: donorEntity.name,
        email: donorEntity.email,
        phone: donorEntity.phone,
        dateOfBirth: donorEntity.dateOfBirth,
        city: donorEntity.city,
        bloodType: donorEntity.bloodType,
        weight: donorEntity.weight,
        createdAt: donorEntity.createdAt,
        age: age,
        eligible: eligible,
        lastDonation,
        registrationDate: registeredAt,
        donationHistory,
      };
    });
    return {
      items: result,
      totalCount: donors.totalCount,
    };
  }
}
