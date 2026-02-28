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
import {
  ResponseDonorsDto,
  DonorByIdDto,
  DonorStatsDto,
} from './dtos/response-donors.dto';
import { GetDonorStatsUseCase } from '../../application/use-cases/get-donor-stats.use-case ';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

@ApiTags('Donors')
@Controller({
  path: 'donors',
  version: '1',
})
export class DonorController {
  constructor(
    private readonly registerDonorUseCase: RegisterDonorUseCase,
    private readonly getAllDonorsUseCase: GetAllDonorUseCase,
    private readonly getDonorByIdUseCase: GetDonorByIdUseCase,
    private readonly getDonorStatsUseCase: GetDonorStatsUseCase,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: ResponseDonorsDto,
    description: 'Donor registered successfully (returned inside list)',
  })
  async registerDonor(
    @Body() registerDonorRequestDto: RegisterDonorRequestDto,
  ) {
    return this.registerDonorUseCase.execute(registerDonorRequestDto);
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.STAFF, Role.ADMIN)
  @Get()
  @ApiOkResponse({
    type: ResponseDonorsDto,
    description: 'List of donors with pagination',
  })
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

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.STAFF, Role.ADMIN)
  @Get('stats')
  @ApiOkResponse({
    type: DonorStatsDto,
    description: 'Snapshot of donor statistics',
  })
  async getStats() {
    return this.getDonorStatsUseCase.execute();
  }

  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.STAFF, Role.ADMIN)
  @Get(':id')
  @ApiOkResponse({
    type: DonorByIdDto,
    description: 'Information for a single donor',
  })
  async getDonorById(@Param('id') id: string) {
    return this.getDonorByIdUseCase.execute(id);
  }
}
