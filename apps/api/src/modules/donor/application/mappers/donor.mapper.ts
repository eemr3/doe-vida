import { DonationEntity } from '../../domain/entities/donation.entiry';
import { DonorEntity } from '../../domain/entities/donor.entity';
import { DonorResponseDto } from '../dtos/donor-response';

export class DonorMapper {
  static toResponse(
    donor: DonorEntity,
    donations?: DonationEntity[],
  ): DonorResponseDto {
    return {
      id: donor.id,
      name: donor.name,
      email: donor.email,
      phone: donor.phone,
      dateOfBirth: donor.dateOfBirth,
      city: donor.city,
      bloodType: donor.bloodType,
      weight: donor.weight,
      createdAt: donor.createdAt,
      donations:
        donations && donations.length > 0
          ? donations?.map((donation) => ({
              id: donation?.id,
              donorId: donation?.donorId ?? '',
              dateDonation: donation?.dateDonation ?? new Date(),
              location: donation?.location,
            }))
          : [],
    };
  }
}
