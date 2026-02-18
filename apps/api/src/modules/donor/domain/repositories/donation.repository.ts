import { DonationEntity } from '../entities/donation.entiry';

export const DONATION_REPOSITORY = 'DONATION_REPOSITORY';

export interface IDonationRepository {
  create(donation: DonationEntity): Promise<DonationEntity>;
  findById(id: string): Promise<DonationEntity | null>;
  findAll(): Promise<DonationEntity[]>;
  update(donation: DonationEntity): Promise<DonationEntity>;
}
