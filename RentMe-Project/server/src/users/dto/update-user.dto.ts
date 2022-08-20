import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  @ApiProperty()
  fullname: string;
}
