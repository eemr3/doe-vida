import { BadRequestError } from '../../../../shared/exceptions/badrequest.error';
import { BloodType } from '../enum/boodtype.enum';
import { DonationEntity } from './donation.entiry';

export class DonorEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public phone: string,
    public dateOfBirth: Date,
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

  public canDonate(lastDonationDate?: Date): boolean {
    if (DonorEntity.calculateAge(this.dateOfBirth) < 16) return false;
    if (this.weight < 50) return false;
    if (!lastDonationDate) return true;

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    return lastDonationDate <= threeMonthsAgo;
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
