import { ApiProperty } from '@nestjs/swagger';

export class DonationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  donorId?: string;

  @ApiProperty({ type: String, format: 'date-time', required: false })
  dateDonation?: Date;

  @ApiProperty({ required: false })
  location?: string;
}
