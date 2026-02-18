import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DonorOrmEntity } from './donor.orm-entity';

@Entity('donations')
export class DonationOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'donor_id' })
  donorId?: string;

  @Column({ name: 'date_donation' })
  dateDonation?: Date;

  @Column({ name: 'location' })
  location?: string;

  @ManyToOne(() => DonorOrmEntity, (donor) => donor.id, { nullable: true })
  @JoinColumn({ name: 'donor_id' })
  donor: DonorOrmEntity;
}
