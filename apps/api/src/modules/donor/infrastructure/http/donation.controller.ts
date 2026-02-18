import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AddDonationUseCase } from '../../application/use-cases/add-donation.use-case';
import { RequestDonationDto } from './dtos/request-donation.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { Role } from '../../../auth/domain/role.enum';

@Controller('donations')
export class DonationController {
  constructor(private readonly donationService: AddDonationUseCase) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.STAFF, Role.ADMIN)
  async createDonation(@Body() data: RequestDonationDto) {
    return this.donationService.execute(data);
  }
}
