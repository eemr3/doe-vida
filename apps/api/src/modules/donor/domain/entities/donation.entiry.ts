export class DonationEntity {
  constructor(
    public readonly id: string,
    public readonly donorId?: string,
    public readonly dateDonation?: Date,
    public readonly location?: string,
  ) {}
}
