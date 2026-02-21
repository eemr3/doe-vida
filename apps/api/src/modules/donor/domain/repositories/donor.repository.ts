import { EntityManager } from 'typeorm';
import { ResponseDonorsDto } from '../../infrastructure/http/dtos/response-donors.dto';
import { DonorEntity } from '../entities/donor.entity';

export const DONOR_REPOSITORY = 'DONOR_REPOSITORY';

export interface IDonorRepository {
  save(donor: DonorEntity, manager?: EntityManager): Promise<DonorEntity>;
  findByEmail(
    email: string,
    manager?: EntityManager,
  ): Promise<DonorEntity | null>;
  findById(id: string): Promise<DonorEntity | null>;
  findAll(): Promise<ResponseDonorsDto>;
  update(donor: DonorEntity): Promise<DonorEntity>;
}
