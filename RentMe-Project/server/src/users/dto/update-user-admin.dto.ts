import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserByAdminDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  @ApiProperty()
  fullname: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  @ApiProperty()
  role: string;
}
