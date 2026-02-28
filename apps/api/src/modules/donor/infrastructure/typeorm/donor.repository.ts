import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { DonationEntity } from '../../domain/entities/donation.entiry';
import { DonorEntity } from '../../domain/entities/donor.entity';
import {
  DonorQuery,
  DonorStatsDto,
  FindAllDonorsResult,
  IDonorRepository,
} from '../../domain/repositories/donor.repository';
import { DonorOrmEntity } from './donor.orm-entity';

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

  async findAll(query: DonorQuery): Promise<FindAllDonorsResult> {
    const page = query.page ?? 1;
    const limit = query.pageSize ?? 10;

    const db = this.donorRepo
      .createQueryBuilder('donor')
      .leftJoinAndSelect('donor.donations', 'donations');

    if (query.search) {
      if (query.search) {
        db.andWhere('(donor.name ILIKE :search OR donor.email ILIKE :search)', {
          search: `%${query.search}%`,
        });
      }
    }
    if (query.city) {
      db.andWhere('donor.city = :city', { city: query.city });
    }

    if (query.bloodType) {
      db.andWhere('donor.bloodType = :bloodType', {
        bloodType: Number(query.bloodType),
      });
    }

    if (query.eligible !== undefined) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const minBirthDate = new Date(today);
      minBirthDate.setFullYear(today.getFullYear() - DonorEntity.getMaxAge());
      const maxBirthDate = new Date(today);
      maxBirthDate.setFullYear(today.getFullYear() - DonorEntity.getMinAge());

      if (query.eligible === true) {
        // Peso OK + idade OK + (sem doações OU intervalo já cumprido)
        db.andWhere('donor.weight >= :minWeight', { minWeight: 50 });
        db.andWhere('donor.date_of_birth >= :minBirth', {
          minBirth: minBirthDate,
        });
        db.andWhere('donor.date_of_birth <= :maxBirth', {
          maxBirth: maxBirthDate,
        });
        db.andWhere(
          `(
          NOT EXISTS (
            SELECT 1 FROM donations d2 WHERE d2."donor_id" = donor.id
          )
          OR (
            SELECT MAX(d3."date_donation") FROM donations d3 WHERE d3."donor_id" = donor.id
          ) + (
            CASE donor.gender
              WHEN 'MALE' THEN INTERVAL '60 days'
              ELSE INTERVAL '90 days'
            END
          ) <= :today
        )`,
          { today },
        );
      } else {
        // eligible = false: peso baixo OU idade fora do range OU intervalo não cumprido
        db.andWhere(
          `(
          donor.weight < :minWeight
          OR donor.date_of_birth < :minBirth
          OR donor.date_of_birth > :maxBirth
          OR (
            EXISTS (
              SELECT 1 FROM donations d2 WHERE d2."donor_id" = donor.id
            )
            AND (
              SELECT MAX(d3."date_donation") FROM donations d3 WHERE d3."donor_id" = donor.id
            ) + (
              CASE donor.gender
                WHEN 'MALE' THEN INTERVAL '60 days'
                ELSE INTERVAL '90 days'
              END
            ) > :today
          )
        )`,
          {
            minWeight: 50,
            minBirth: minBirthDate,
            maxBirth: maxBirthDate,
            today,
          },
        );
      }
    }
    db.skip((Number(page) - 1) * Number(limit));
    db.take(Number(limit));

    const [entities, total] = await db.getManyAndCount();

    const result = entities.map((entity) => ({
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
          donorId: donation.donorId ?? entity.id,
          dateDonation: donation.dateDonation!,
          location: donation.location ?? '',
        })) ?? [],
    }));
    return {
      items: result,
      totalCount: total,
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

  async getStats(): Promise<DonorStatsDto> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    now.setHours(0, 0, 0, 0);

    const minBirthDate = new Date(now);
    minBirthDate.setFullYear(now.getFullYear() - DonorEntity.getMaxAge());

    const maxBirthDate = new Date(now);
    maxBirthDate.setFullYear(now.getFullYear() - DonorEntity.getMinAge());

    const totalCount = await this.donorRepo.count();

    const eligibleCount = await this.donorRepo
      .createQueryBuilder('donor')
      .where('donor.weight >= :minWeight', { minWeight: 50 })
      .andWhere('donor.date_of_birth >= :minBirth', { minBirth: minBirthDate })
      .andWhere('donor.date_of_birth <= :maxBirth', { maxBirth: maxBirthDate })
      .andWhere(
        `(
        NOT EXISTS (
          SELECT 1 FROM donations d2 WHERE d2."donor_id" = donor.id
        )
        OR (
          SELECT MAX(d3."date_donation") FROM donations d3 WHERE d3."donor_id" = donor.id
        ) + (
          CASE donor.gender
            WHEN 'MALE' THEN INTERVAL '60 days'
            ELSE INTERVAL '90 days'
          END
        ) <= :today
      )`,
        { today: now },
      )
      .getCount();

    const waitingCount = await this.donorRepo
      .createQueryBuilder('donor')
      .where('donor.weight >= :minWeight', { minWeight: 50 })
      .andWhere('donor.date_of_birth >= :minBirth', { minBirth: minBirthDate })
      .andWhere('donor.date_of_birth <= :maxBirth', { maxBirth: maxBirthDate })
      .andWhere(
        `
      EXISTS (
        SELECT 1 FROM donations d2 WHERE d2."donor_id" = donor.id
      )
      AND (
        SELECT MAX(d3."date_donation") FROM donations d3 WHERE d3."donor_id" = donor.id
      ) + (
        CASE donor.gender
          WHEN 'MALE' THEN INTERVAL '60 days'
          ELSE INTERVAL '90 days'
        END
      ) > :today
    `,
        { today: now },
      )
      .getCount();

    const newThisMonthCount = await this.donorRepo
      .createQueryBuilder('donor')
      .where('donor.createdAt >= :firstDay', { firstDay: firstDayOfMonth })
      .getCount();

    return {
      totalCount,
      eligibleCount,
      waitingCount,
      newThisMonthCount,
    };
  }
}
