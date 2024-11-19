export class Location {
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

  children?: Location[];
  parent?: Location;
}
