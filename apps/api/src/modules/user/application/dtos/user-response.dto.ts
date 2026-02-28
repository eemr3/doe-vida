import { ApiProperty } from '@nestjs/swagger';

export class UserItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  isActive: boolean;
}

export class UserResponseDto {
  @ApiProperty({ type: [UserItem] })
  items: UserItem[];

  @ApiProperty()
  totalCount: number;
}
