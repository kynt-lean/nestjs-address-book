import { EntitySchema } from 'typeorm';
import { EntityPropertyChange } from '../entities/entity-property-change';

export const EntityPropertyChangeSchema =
  new EntitySchema<EntityPropertyChange>({
    name: 'EntityPropertyChange',
    target: EntityPropertyChange,
    tableName: 'EntityPropertyChanges',
    columns: {
      id: { type: 'varchar', length: 36, primary: true },
      entityChangeId: { type: 'varchar', length: 36, name: 'entity_change_id' },
      propertyName: {
        type: 'character varying',
        length: 128,
        name: 'property_name',
      },
      oldValue: {
        type: 'character varying',
        length: 512,
        name: 'old_value',
        nullable: true,
      },
      newValue: {
        type: 'character varying',
        length: 512,
        name: 'new_value',
        nullable: true,
      },
    },
    relations: {
      entityChange: {
        type: 'many-to-one',
        target: 'EntityChange',
        inverseSide: 'propertyChanges',
        joinColumn: { name: 'entity_change_id' },
      },
    },
    indices: [
      {
        name: 'IDX_PROPERTY_NAME',
        columns: ['propertyName'],
      },
    ],
  });
