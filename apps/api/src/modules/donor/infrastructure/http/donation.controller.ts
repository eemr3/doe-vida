import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AddDonationUseCase } from '../../application/use-cases/add-donation.use-case';
import { RequestDonationDto } from './dtos/request-donation.dto';
import { DonationResponseDto } from '../../application/dtos/donation-response';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { Role } from '../../../auth/domain/role.enum';
import { ApiBearerAuth, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';

@ApiTags('Donations')
@ApiBearerAuth('JWT')
@Controller({
  path: 'donations',
  version: '1',
})
export class DonationController {
  constructor(private readonly donationService: AddDonationUseCase) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.STAFF, Role.ADMIN)
  @ApiCreatedResponse({
    type: DonationResponseDto,
    description: 'Donation recorded',
  })
  async createDonation(@Body() data: RequestDonationDto) {
    return this.donationService.execute(data);
  }
}
