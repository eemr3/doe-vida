// eligibility-result.vo.ts
export type IneligibilityReason =
  | 'WEIGHT_TOO_LOW'
  | 'TOO_YOUNG'
  | 'TOO_OLD'
  | 'DONATION_INTERVAL_NOT_MET';

export class EligibilityResult {
  private constructor(
    public readonly eligible: boolean,
    public readonly reason?: IneligibilityReason,
    public readonly nextDonationDate?: Date,
  ) {}

  static eligible(): EligibilityResult {
    return new EligibilityResult(true);
  }

  static ineligible(
    reason: IneligibilityReason,
    nextDonationDate?: Date,
  ): EligibilityResult {
    return new EligibilityResult(false, reason, nextDonationDate);
  }
}
