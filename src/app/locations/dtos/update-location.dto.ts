import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateLocationDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @IsOptional()
  building?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @IsOptional()
  name?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @IsOptional()
  locationNumber?: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  area?: number;
}
