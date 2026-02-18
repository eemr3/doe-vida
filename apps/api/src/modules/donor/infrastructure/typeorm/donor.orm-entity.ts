import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { BloodType } from '../../domain/enum/boodtype.enum';
import { DonationOrmEntity } from './donation.orm-entity';

@Entity('donors')
export class DonorOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column()
  city: string;

  @Column({ name: 'blood_type' })
  bloodType: BloodType;

  @Column({ name: 'weight', type: 'decimal', precision: 5, scale: 2 })
  weight: number;

  @OneToMany(() => DonationOrmEntity, (donation) => donation.donor)
  donations: DonationOrmEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
