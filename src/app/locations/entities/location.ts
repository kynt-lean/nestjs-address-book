import { BaseEntity } from 'typeorm';

export class Location extends BaseEntity {
  id: string;
  building: string;
  name: string;
  locationNumber: string;
  level: number;
  area: number;

  creator?: string;
  creationTime?: Date;
  lastModifier?: string;
  lastModificationTime?: Date;
  deleter?: string;
  deletionTime?: Date;

  parent?: Location;
  children?: Location[];
}
