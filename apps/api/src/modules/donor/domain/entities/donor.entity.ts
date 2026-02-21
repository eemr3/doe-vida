import { randomUUID } from 'crypto';
import { BadRequestError } from '../../../../shared/exceptions/badrequest.error';
import { BloodType } from '../enum/boodtype.enum';
import { GenderType } from '../enum/Gender-type.enum';
import { Donor } from '../types/donor';
import { DonationEntity } from './donation.entiry';
import { EligibilityResult } from '../value-object/eligibility-result.vo';

export class DonorEntity {
  private static readonly MIN_WEIGHT = 50;
  private static readonly MIN_AGE = 16;
  private static readonly MAX_AGE = 69;
  private static readonly MALE_DONATION_INTERVAL_DAYS = 60;
  private static readonly FEMALE_DONATION_INTERVAL_DAYS = 90;

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
  ) {}

  static create(donor: Donor): DonorEntity {
    const age = DonorEntity.calculateAge(donor.dateOfBirth);

    if (age < DonorEntity.MIN_AGE || age > DonorEntity.MAX_AGE) {
      throw new BadRequestError(
        `Donor must be between ${DonorEntity.MIN_AGE} and ${DonorEntity.MAX_AGE} years old`,
      );
    }

    if (donor.weight < DonorEntity.MIN_WEIGHT) {
      throw new BadRequestError(
        `Donor must weigh at least ${DonorEntity.MIN_WEIGHT}kg`,
      );
    }

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

  public checkEligibility(): EligibilityResult {
    if (this.weight < DonorEntity.MIN_WEIGHT) {
      return EligibilityResult.ineligible('WEIGHT_TOO_LOW');
    }

    const age = this.getAge();

    if (age < DonorEntity.MIN_AGE) {
      return EligibilityResult.ineligible('TOO_YOUNG');
    }

    if (age > DonorEntity.MAX_AGE) {
      return EligibilityResult.ineligible('TOO_OLD');
    }

    const lastDonation = this.getLastDonationDate();

    if (lastDonation) {
      const nextDonationDate = this.calculateNextDonationDate(lastDonation);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (today < nextDonationDate) {
        return EligibilityResult.ineligible(
          'DONATION_INTERVAL_NOT_MET',
          nextDonationDate,
        );
      }
    }

    return EligibilityResult.eligible();
  }

  public getNextDonationDate(): Date | null {
    const lastDonation = this.getLastDonationDate();
    if (!lastDonation) return null;
    return this.calculateNextDonationDate(lastDonation);
  }

  public getAge(): number {
    return DonorEntity.calculateAge(this.dateOfBirth);
  }

  private getLastDonationDate(): Date | null {
    if (!this.donations?.length) return null;

    return (
      [...this.donations].sort(
        (a, b) =>
          (b?.dateDonation?.getTime() ?? 0) - (a?.dateDonation?.getTime() ?? 0),
      )[0]?.dateDonation ?? null
    );
  }

  private calculateNextDonationDate(lastDonation: Date): Date {
    const interval =
      this.gender === GenderType.MALE
        ? DonorEntity.MALE_DONATION_INTERVAL_DAYS
        : DonorEntity.FEMALE_DONATION_INTERVAL_DAYS;

    const next = new Date(lastDonation);
    next.setDate(next.getDate() + interval);
    return next;
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

    if (birthThisYear > today) age--;

    return age;
  }
}
