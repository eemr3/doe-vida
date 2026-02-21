import { InjectRepository } from '@nestjs/typeorm';
import { DonationEntity } from '../../domain/entities/donation.entiry';
import { IDonationRepository } from '../../domain/repositories/donation.repository';
import { DonationOrmEntity } from './donation.orm-entity';
import { EntityManager, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmDonationRepository implements IDonationRepository {
  constructor(
    @InjectRepository(DonationOrmEntity)
    private readonly donationRepo: Repository<DonationOrmEntity>,
  ) {}

  async create(
    donation: DonationEntity,
    manager?: EntityManager,
  ): Promise<DonationEntity> {
    const repo = manager
      ? manager.getRepository(DonationOrmEntity)
      : this.donationRepo;

    const saved = await repo.save(donation);
    return new DonationEntity(
      saved.id,
      saved.donorId,
      saved.dateDonation,
      saved.location,
    );
  }

  async findById(id: string): Promise<DonationEntity | null> {
    const entity = await this.donationRepo.findOne({ where: { id } });
    return entity
      ? new DonationEntity(
          entity.id,
          entity.donorId,
          entity.dateDonation,
          entity.location,
        )
      : null;
  }

  async findAll(): Promise<DonationEntity[]> {
    const entities = await this.donationRepo.find();
    return entities.map(
      (entity) =>
        new DonationEntity(
          entity.id,
          entity.donorId,
          entity.dateDonation,
          entity.location,
        ),
    );
  }

  async update(donation: DonationEntity): Promise<DonationEntity> {
    const ormDonation = new DonationOrmEntity();
    ormDonation.id = donation.id;
    ormDonation.donorId = donation.donorId;
    ormDonation.dateDonation = donation.dateDonation;
    ormDonation.location = donation.location;

    await this.donationRepo.save(ormDonation);
    return donation;
  }
}
