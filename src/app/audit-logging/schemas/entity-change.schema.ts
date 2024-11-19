import { EntitySchema } from 'typeorm';
import { EntityChange } from '../entities/entity-change';

export const EntityChangeSchema = new EntitySchema<EntityChange>({
  name: 'EntityChange',
  target: EntityChange,
  tableName: 'EntityChanges',
  columns: {
    id: { type: 'varchar', length: 36, primary: true },
    entityName: { type: 'character varying', length: 128, name: 'entity_name' },
    entityId: { type: 'varchar', length: 128, name: 'entity_id' },
    changeType: { type: 'smallint', name: 'change_type' },
    changeTime: { type: 'timestamp', name: 'change_time' },
    correlationId: { type: 'varchar', length: 36, name: 'correlation_id' },
    actorId: { type: 'varchar', length: 128, name: 'actor_id' },
    actorType: { type: 'smallint', name: 'actor_type' },
  },
  relations: {
    propertyChanges: {
      type: 'one-to-many',
      target: 'EntityPropertyChange',
      inverseSide: 'entityChange',
      cascade: ['insert', 'update'],
    },
  },
  indices: [
    { name: 'IDX_ENTITY_ID', columns: ['entityId'] },
    { name: 'IDX_CORRELATION_ID', columns: ['correlationId'] },
    { name: 'IDX_ACTOR_ID', columns: ['actorId'] },
  ],
});
