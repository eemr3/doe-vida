import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class SetUserActiveRequestDto {
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  isActive: boolean;
}
