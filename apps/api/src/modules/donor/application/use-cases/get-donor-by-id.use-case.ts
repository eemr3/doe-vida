import { Inject } from '@nestjs/common';
import {
  DONOR_REPOSITORY,
  IDonorRepository,
} from '../../domain/repositories/donor.repository';
import { DonorByIdResponseDto, DonorResponseDto } from '../dtos/donor-response';
import { NotFoundError } from '../../../../shared/exceptions/not-found.error';
import { DonorMapper } from '../mappers/donor.mapper';

export class GetDonorByIdUseCase {
  constructor(
    @Inject(DONOR_REPOSITORY)
    private readonly donorRepository: IDonorRepository,
  ) {}

  async execute(id: string): Promise<DonorByIdResponseDto> {
    const donor = await this.donorRepository.findById(id);
    if (!donor) {
      throw new NotFoundError('Donor not found');
    }
    return DonorMapper.toByIdResponse(donor, donor.donations);
  }
}
