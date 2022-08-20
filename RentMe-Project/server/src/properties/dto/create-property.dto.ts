import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreatePropertyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  price: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  bedrooms: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  bathrooms: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  @IsLatitude()
  @ApiProperty()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  @IsLongitude()
  @ApiProperty()
  longitude: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({ required: false })
  size?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  url?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ required: false, isArray: true })
  images?: { imageUrl: string; imagePublicId: string }[];
}
