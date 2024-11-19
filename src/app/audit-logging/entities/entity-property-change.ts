import { BaseEntity } from 'typeorm';
import type { EntityChange } from './entity-change';

export class EntityPropertyChange extends BaseEntity {
  id: string;
  entityChangeId: string;
  propertyName: string;
  oldValue: string | null = null;
  newValue: string | null = null;

  entityChange?: EntityChange;
}
