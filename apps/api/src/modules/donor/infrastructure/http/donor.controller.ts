import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Role } from '../../../auth/domain/role.enum';
import { GetAllDonorUseCase } from '../../application/use-cases/get-all-donor.use-case';
import { GetDonorByIdUseCase } from '../../application/use-cases/get-donor-by-id.use-case';
import { RegisterDonorUseCase } from '../../application/use-cases/register-donor.use-case';
import { DonorQueryDto } from './dtos/donor-query.dto';
import { RegisterDonorRequestDto } from './dtos/request.dto';
import { GetDonorStatsUseCase } from '../../application/use-cases/get-donor-stats.use-case ';

@Controller('donors')
export class DonorController {
  constructor(
    private readonly registerDonorUseCase: RegisterDonorUseCase,
    private readonly getAllDonorsUseCase: GetAllDonorUseCase,
    private readonly getDonorByIdUseCase: GetDonorByIdUseCase,
    private readonly getDonorStatsUseCase: GetDonorStatsUseCase,
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
  async getAllDonors(@Query() query: DonorQueryDto) {
    return this.getAllDonorsUseCase.execute({
      page: query.page,
      pageSize: query.pageSize,
      city: query.city,
      bloodType: query.bloodType,
      eligible: query.eligible,
      search: query.search,
    });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.STAFF, Role.ADMIN)
  @Get('stats')
  async getStats() {
    return this.getDonorStatsUseCase.execute();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.STAFF, Role.ADMIN)
  @Get(':id')
  async getDonorById(@Param('id') id: string) {
    return this.getDonorByIdUseCase.execute(id);
  }
}
