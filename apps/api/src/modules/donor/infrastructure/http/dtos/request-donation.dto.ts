import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestDonationDto {
  @ApiProperty({ description: 'ID of the donor making the donation' })
  @IsString()
  @IsNotEmpty()
  donorId: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'Location where donation occurred' })
  @IsNotEmpty()
  @IsString()
  location: string;
}
