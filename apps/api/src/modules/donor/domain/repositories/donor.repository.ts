import { EntityManager } from 'typeorm';
import { DonorEntity } from '../entities/donor.entity';
import { BloodType } from '../enum/boodtype.enum';
import { DonorListItem } from '../models/donor-list-item';

export const DONOR_REPOSITORY = 'DONOR_REPOSITORY';

export interface DonorQuery {
  page?: string;
  pageSize?: string;
  city?: string;
  bloodType?: BloodType;
  eligible?: boolean;
  search?: string;
}

export interface FindAllDonorsResult {
  items: DonorListItem[];
  totalCount: number;
}

export interface DonorStatsDto {
  totalCount: number;
  eligibleCount: number;
  waitingCount: number;
  newThisMonthCount: number;
}
export interface IDonorRepository {
  save(donor: DonorEntity, manager?: EntityManager): Promise<DonorEntity>;
  findByEmail(
    email: string,
    manager?: EntityManager,
  ): Promise<DonorEntity | null>;
  findById(id: string): Promise<DonorEntity | null>;
  findAll(query: DonorQuery): Promise<FindAllDonorsResult>;
  update(donor: DonorEntity): Promise<DonorEntity>;
  getStats(): Promise<DonorStatsDto>;
}
