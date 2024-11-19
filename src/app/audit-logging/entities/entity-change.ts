import { BaseEntity } from 'typeorm';
import { eActorType } from '../../../core/audit-logging/actor-type.enum';
import { eChangeType } from '../enums/change-type.enum';
import type { EntityPropertyChange } from './entity-property-change';

export class EntityChange extends BaseEntity {
  id: string;
  entityName: string;
  entityId: string;
  changeType: eChangeType;
  changeTime: Date;
  correlationId: string;
  actorId: string;
  actorType: eActorType;

  propertyChanges: EntityPropertyChange[];
}
