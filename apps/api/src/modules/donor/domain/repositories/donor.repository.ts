import { EntityManager } from 'typeorm';
import { ResponseDonorsDto } from '../../infrastructure/http/dtos/response-donors.dto';
import { DonorEntity } from '../entities/donor.entity';
import { EligibilityResult } from '../value-objects/eligibility-result.vo';
import { BloodType } from '../enum/boodtype.enum';

export const DONOR_REPOSITORY = 'DONOR_REPOSITORY';

export interface DonorQuery {
  page?: string;
  pageSize?: string;
  city?: string;
  bloodType?: BloodType;
  eligible?: boolean;
  search?: string;
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
  findAll(query: DonorQuery): Promise<ResponseDonorsDto>;
  update(donor: DonorEntity): Promise<DonorEntity>;
  getStats(): Promise<DonorStatsDto>;
}
