import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateLocationDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  building: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  locationNumber: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  area: number;

  @Expose()
  @IsString()
  @IsOptional()
  @MaxLength(36)
  parentId?: string;
}
