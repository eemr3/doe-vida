import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RegisterDonorRequestDto } from './dtos/request.dto';
import { RegisterDonorUseCase } from '../../application/use-cases/register-donor.use-case';
import { GetAllDonorUseCase } from '../../application/use-cases/get-all-donor.use-case';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { Role } from '../../../auth/domain/role.enum';
import { GetDonorByIdUseCase } from '../../application/use-cases/get-donor-by-id.use-case';

@Controller('donors')
export class DonorController {
  constructor(
    private readonly registerDonorUseCase: RegisterDonorUseCase,
    private readonly getAllDonorsUseCase: GetAllDonorUseCase,
    private readonly getDonorByIdUseCase: GetDonorByIdUseCase,
  ) {}

  @Post()
  async registerDonor(
    @Body() registerDonorRequestDto: RegisterDonorRequestDto,
  ) {
    return this.registerDonorUseCase.execute(registerDonorRequestDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.STAFF, Role.ADMIN)
  @Get()
  async getAllDonors() {
    return this.getAllDonorsUseCase.execute();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.STAFF, Role.ADMIN)
  @Get(':id')
  async getDonorById(@Param('id') id: string) {
    return this.getDonorByIdUseCase.execute(id);
  }
}
