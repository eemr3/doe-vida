import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  DONOR_REPOSITORY,
  IDonorRepository,
} from '../../domain/repositories/donor.repository';
import {
  DONATION_REPOSITORY,
  IDonationRepository,
} from '../../domain/repositories/donation.repository';
import { CreateDonorDto } from '../dtos/create-donor.dto';
import { DonorResponseDto } from '../dtos/donor-response';
import { DonorMapper } from '../mappers/donor.mapper';
import { DonorEntity } from '../../domain/entities/donor.entity';
import { DonationEntity } from '../../domain/entities/donation.entiry';
import { randomUUID } from 'crypto';
import { ConflictError } from '../../../../shared/exceptions/conflict.error';
import { DonorOrmEntity } from '../../infrastructure/typeorm/donor.orm-entity';
import { DonationOrmEntity } from '../../infrastructure/typeorm/donation.orm-entity';
import {
  ITransactionsService,
  TRANSACTIONS_SERVICE,
} from '../../../../shared/transaction/transactions.service';

@Injectable()
export class RegisterDonorUseCase {
  constructor(
    @Inject(TRANSACTIONS_SERVICE)
    private readonly transactionsService: ITransactionsService,
    @Inject(DONOR_REPOSITORY)
    private readonly donorRepository: IDonorRepository,

    @Inject(DONATION_REPOSITORY)
    private readonly donationRepository: IDonationRepository,
  ) {}

  async execute(data: CreateDonorDto): Promise<DonorResponseDto> {
    return this.transactionsService.run(async (manager) => {
      const donorExists = await this.donorRepository.findByEmail(
        data.email,
        manager,
      );

      if (donorExists) {
        throw new ConflictError('Donor already exists');
      }

      const donor = DonorEntity.create(data);
      const saveDonor = await this.donorRepository.save(donor, manager);

      if (data.lastDonationDate && data.lastDonationLocation) {
        const donation = new DonationEntity(
          randomUUID(),
          saveDonor.id,
          new Date(data.lastDonationDate),
          data.lastDonationLocation,
        );

        await this.donationRepository.create(donation, manager);
      }

      return DonorMapper.toResponse(saveDonor);
    });
  }
}
