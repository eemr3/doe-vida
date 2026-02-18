import { DonorEntity } from '../entities/donor.entity';

export const DONOR_REPOSITORY = 'DONOR_REPOSITORY';

export interface IDonorRepository {
  create(donor: DonorEntity): Promise<DonorEntity>;
  findByEmail(email: string): Promise<DonorEntity | null>;
  findById(id: string): Promise<DonorEntity | null>;
  findAll(): Promise<DonorEntity[]>;
  update(donor: DonorEntity): Promise<DonorEntity>;
}
