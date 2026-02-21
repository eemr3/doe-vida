import { Inject, Injectable } from '@nestjs/common';
import {
  DONOR_REPOSITORY,
  DonorStatsDto,
  IDonorRepository,
} from '../../domain/repositories/donor.repository';

@Injectable()
export class GetDonorStatsUseCase {
  constructor(
    @Inject(DONOR_REPOSITORY)
    private readonly donorRepository: IDonorRepository,
  ) {}

  async execute(): Promise<DonorStatsDto> {
    return await this.donorRepository.getStats();
  }
}
