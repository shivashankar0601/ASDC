import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePropertyImageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  imagePublicId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  imageUrl: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  imageDescription?: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  propertyId: number;
}
