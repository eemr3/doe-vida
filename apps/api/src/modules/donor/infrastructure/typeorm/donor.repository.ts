import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonorEntity } from '../../domain/entities/donor.entity';
import { IDonorRepository } from '../../domain/repositories/donor.repository';
import { DonorOrmEntity } from './donor.orm-entity';
import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmDonorRepository implements IDonorRepository {
  constructor(
    @InjectRepository(DonorOrmEntity)
    private readonly donorRepo: Repository<DonorOrmEntity>,
  ) {}

  async create(donor: DonorEntity): Promise<DonorEntity> {
    const ormDonor = new DonorOrmEntity();
    ormDonor.id = randomUUID();
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

  async findById(id: string): Promise<DonorEntity | null> {
    const entity = await this.donorRepo.findOne({ where: { id } });
    return entity
      ? new DonorEntity(
          entity.id,
          entity.name,
          entity.email,
          entity.phone,
          entity.dateOfBirth,
          entity.city,
          entity.bloodType,
          entity.weight,
          entity.createdAt,
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
          entity.city,
          entity.bloodType,
          entity.weight,
          entity.createdAt,
        )
      : null;
  }

  async findAll(): Promise<DonorEntity[]> {
    const entities = await this.donorRepo.find();
    return entities.map(
      (entity) =>
        new DonorEntity(
          entity.id,
          entity.name,
          entity.email,
          entity.phone,
          entity.dateOfBirth,
          entity.city,
          entity.bloodType,
          entity.weight,
          entity.createdAt,
        ),
    );
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
