import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  building: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  locationNumber: string;

  @IsNumber()
  level: number;

  @IsString()
  @IsNotEmpty()
  area: string;

  @IsString()
  @IsOptional()
  parentId?: string;
}
