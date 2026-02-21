import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { DonorEntity } from '../../domain/entities/donor.entity';
import { IDonorRepository } from '../../domain/repositories/donor.repository';
import { DonorOrmEntity } from './donor.orm-entity';
import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ResponseDonorsDto } from '../http/dtos/response-donors.dto';
import { DonationOrmEntity } from './donation.orm-entity';
import { DonationEntity } from '../../domain/entities/donation.entiry';

@Injectable()
export class TypeOrmDonorRepository implements IDonorRepository {
  constructor(
    @InjectRepository(DonorOrmEntity)
    private readonly donorRepo: Repository<DonorOrmEntity>,
  ) {}

  async save(
    donor: DonorEntity,
    manager?: EntityManager,
  ): Promise<DonorEntity> {
    const repo = manager
      ? manager.getRepository(DonorOrmEntity)
      : this.donorRepo;

    const saved = await repo.save(donor);
    return saved;
  }

  async findById(id: string): Promise<DonorEntity | null> {
    const entity = await this.donorRepo.findOne({
      where: { id },
      relations: ['donations'],
      order: {
        donations: {
          dateDonation: 'DESC',
        },
      },
    });
    return entity
      ? new DonorEntity(
          entity.id,
          entity.name,
          entity.email,
          entity.phone,
          entity.dateOfBirth,
          entity.gender,
          entity.city,
          entity.bloodType,
          entity.weight,
          entity.createdAt,
          entity.donations?.map(
            (donation) =>
              new DonationEntity(
                donation.id,
                donation.donorId,
                donation.dateDonation
                  ? new Date(donation.dateDonation)
                  : undefined,
                donation.location,
              ),
          ),
        )
      : null;
  }

  async findByEmail(email: string): Promise<DonorEntity | null> {
    const entity = await this.donorRepo.findOne({ where: { email } });
    return entity
      ? new DonorEntity(
          entity.id,
          entity.name,
          entity.email,
          entity.phone,
          entity.dateOfBirth,
          entity.gender,
          entity.city,
          entity.bloodType,
          entity.weight,
          entity.createdAt,
        )
      : null;
  }

  async findAll(): Promise<ResponseDonorsDto> {
    const entities = await this.donorRepo.find({ relations: ['donations'] });
    const result = entities.map(
      (entity) =>
        new DonorEntity(
          entity.id,
          entity.name,
          entity.email,
          entity.phone,
          entity.dateOfBirth,
          entity.gender,
          entity.city,
          entity.bloodType,
          entity.weight,
          entity.createdAt,
          entity.donations,
        ),
    );
    return {
      items: result.map((entity) => ({
        id: entity.id,
        name: entity.name,
        email: entity.email,
        phone: entity.phone,
        dateOfBirth: entity.dateOfBirth,
        gender: entity.gender,
        city: entity.city,
        bloodType: entity.bloodType,
        weight: entity.weight,
        createdAt: entity.createdAt,
        donations:
          entity.donations?.map((donation) => ({
            id: donation.id,
            donorId: donation.donorId,
            dateDonation: donation.dateDonation,
            location: donation.location,
          })) ?? [],
      })),
      totalCount: result.length,
    };
  }

  async update(donor: DonorEntity): Promise<DonorEntity> {
    const ormDonor = new DonorOrmEntity();
    ormDonor.id = donor.id;
    ormDonor.name = donor.name;
    ormDonor.email = donor.email;
    ormDonor.phone = donor.phone;
    ormDonor.dateOfBirth = donor.dateOfBirth;
    ormDonor.city = donor.city;
    ormDonor.bloodType = donor.bloodType;
    ormDonor.weight = donor.weight;

    await this.donorRepo.save(ormDonor);

    return donor;
  }
}
