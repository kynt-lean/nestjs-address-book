import { BaseEntity } from 'typeorm';
import { ICreationAuditObject } from '../../domain/interfaces/creation-audit-object.interface';
import { IDeletionAuditObject } from '../../domain/interfaces/deletion-audit-object.interface';
import { IModificationAuditObject } from '../../domain/interfaces/modification-audit-object.interface';

export class Location
  extends BaseEntity
  implements
    ICreationAuditObject,
    IModificationAuditObject,
    IDeletionAuditObject
{
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
