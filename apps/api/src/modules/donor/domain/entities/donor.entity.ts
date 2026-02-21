import { randomUUID } from 'crypto';
import { BadRequestError } from '../../../../shared/exceptions/badrequest.error';
import { CreateDonorDto } from '../../application/dtos/create-donor.dto';
import { BloodType } from '../enum/boodtype.enum';
import { GenderType } from '../enum/Gender-type.enum';
import { Donor } from '../types/donor';
import { DonationEntity } from './donation.entiry';

export class DonorEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public phone: string,
    public dateOfBirth: Date,
    public gender: GenderType,
    public city: string,
    public bloodType: BloodType,
    public weight: number,
    public readonly createdAt: Date,
    public donations?: DonationEntity[],
  ) {
    if (DonorEntity.calculateAge(this.dateOfBirth) < 16)
      throw new BadRequestError('Donor must be at least 16 years old');

    if (this.weight < 50)
      throw new BadRequestError('Donor must be at least 50kg');
  }

  static create(donor: Donor): DonorEntity {
    return new DonorEntity(
      randomUUID(),
      donor.name,
      donor.email,
      donor.phone,
      donor.dateOfBirth,
      donor.gender,
      donor.city,
      donor.bloodType,
      donor.weight,
      new Date(),
    );
  }
  public canDonate(): boolean {
    if (!this.donations?.length) return true;

    const lastDonation = [...this.donations].sort(
      (a, b) =>
        (b?.dateDonation?.getTime() ?? 0) - (a?.dateDonation?.getTime() ?? 0),
    )[0]?.dateDonation;

    if (!lastDonation) return true;

    const interval = this.gender === GenderType.MALE ? 60 : 90;

    const nextDonationDate = new Date(lastDonation);
    nextDonationDate.setDate(nextDonationDate.getDate() + interval);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return today >= nextDonationDate;
  }

  public getNextDonationDate(lastDonationDate?: Date): Date | null {
    if (!lastDonationDate) return null;

    const interval = this.gender === GenderType.MALE ? 60 : 90;

    const nextDonationDate = new Date(lastDonationDate);
    nextDonationDate.setDate(nextDonationDate.getDate() + interval);

    return nextDonationDate;
  }

  public getAge(): number {
    return DonorEntity.calculateAge(this.dateOfBirth);
  }

  private static calculateAge(birthDate: Date): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let age = today.getFullYear() - birthDate.getFullYear();

    const birthThisYear = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate(),
    );
    if (birthThisYear > today) {
      age--;
    }

    return age;
  }
}
