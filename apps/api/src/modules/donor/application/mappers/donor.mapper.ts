import { DonationEntity } from '../../domain/entities/donation.entiry';
import { DonorEntity } from '../../domain/entities/donor.entity';
import { DonorResponseDto } from '../dtos/donor-response';

export class DonorMapper {
  static toResponse(
    donor: DonorEntity,
    donations?: DonationEntity[],
  ): DonorResponseDto {
    return {
      items: [
        {
          id: donor.id,
          name: donor.name,
          email: donor.email,
          phone: donor.phone,
          dateOfBirth: donor.dateOfBirth,
          city: donor.city,
          bloodType: donor.bloodType,
          weight: donor.weight,
          createdAt: donor.createdAt,
          age: donor.getAge(),
          eligible: donor.canDonate(),
          lastDonation: donations?.[0]?.dateDonation ?? null,
          registrationDate: donor.createdAt,
          donationHistory:
            donations?.map((donation) => ({
              dateDonation: donation?.dateDonation!,
              location: donation?.location!,
            })) ?? null,
        },
      ],
      totalCount: 1,
    };
  }
}
