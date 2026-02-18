import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonorOrmEntity } from './infrastructure/typeorm/donor.orm-entity';
import { DonationOrmEntity } from './infrastructure/typeorm/donation.orm-entity';
import { DonorController } from './infrastructure/http/donor.controller';
import { RegisterDonorUseCase } from './application/use-cases/register-donor.use-case';
import { DONOR_REPOSITORY } from './domain/repositories/donor.repository';
import { TypeOrmDonorRepository } from './infrastructure/typeorm/donor.repository';
import { DONATION_REPOSITORY } from './domain/repositories/donation.repository';
import { TypeOrmDonationRepository } from './infrastructure/typeorm/donation.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DonorOrmEntity, DonationOrmEntity])],
  controllers: [DonorController],
  providers: [
    RegisterDonorUseCase,
    {
      provide: DONOR_REPOSITORY,
      useClass: TypeOrmDonorRepository,
    },
    {
      provide: DONATION_REPOSITORY,
      useClass: TypeOrmDonationRepository,
    },
  ],
})
export class DonorModule {}
