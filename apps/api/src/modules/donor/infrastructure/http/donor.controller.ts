import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDonorRequestDto } from './dtos/request.dto';
import { RegisterDonorUseCase } from '../../application/use-cases/register-donor.use-case';

@Controller('donors')
export class DonorController {
  constructor(private readonly registerDonorUseCase: RegisterDonorUseCase) {}

  @Post()
  async registerDonor(
    @Body() registerDonorRequestDto: RegisterDonorRequestDto,
  ) {
    return this.registerDonorUseCase.execute(registerDonorRequestDto);
  }
}
