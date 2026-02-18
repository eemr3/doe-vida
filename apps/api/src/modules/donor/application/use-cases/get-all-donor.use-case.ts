import { Inject } from '@nestjs/common';
import {
  DONOR_REPOSITORY,
  IDonorRepository,
} from '../../domain/repositories/donor.repository';
import { DonorResponseDto } from '../dtos/donor-response';
import { DonorMapper } from '../mappers/donor.mapper';
import { DonorEntity } from '../../domain/entities/donor.entity';

export class GetAllDonorUseCase {
  constructor(
    @Inject(DONOR_REPOSITORY)
    private readonly donorRepository: IDonorRepository,
  ) {}

  async execute(): Promise<DonorResponseDto> {
    const donors = await this.donorRepository.findAll();
    return donors;
  }
}
