import { Expose, Transform } from 'class-transformer';

export class LocationDto {
  @Expose()
  id: string;

  @Expose()
  building: string;

  @Expose()
  name: string;

  @Expose()
  locationNumber: string;

  @Expose()
  level: number;

  @Expose()
  area: string;

  @Expose()
  @Transform(({ obj }) => obj.parent?.id)
  parentId?: string;
}
