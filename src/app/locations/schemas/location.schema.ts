import { EntitySchema } from 'typeorm';
import { CreationAuditSchemaColumns } from '../../domain/schemas/creation-audit-object.schema';
import { DeletionAuditSchemaColumns } from '../../domain/schemas/deletion-audit-object.schema';
import { ModificationAuditSchemaColumns } from '../../domain/schemas/modification-audit-object.schema';
import { Location } from '../entities/location';

export const LocationSchema = new EntitySchema<Location>({
  name: 'Location',
  target: Location,
  tableName: 'locations',
  columns: {
    id: { type: 'varchar', primary: true, length: 36, name: 'id' },
    building: { type: 'varchar', length: 256, name: 'building' },
    name: { type: 'varchar', length: 256, name: 'name' },
    locationNumber: { type: 'varchar', length: 256, name: 'location_number' },
    level: { type: 'int', name: 'level' },
    area: { type: 'decimal', precision: 16, scale: 2, name: 'area' },
    ...CreationAuditSchemaColumns,
    ...ModificationAuditSchemaColumns,
    ...DeletionAuditSchemaColumns,
  },
  relations: {
    children: {
      type: 'one-to-many',
      target: 'Location',
      inverseSide: 'parent',
      cascade: ['insert', 'update'],
    },
    parent: {
      type: 'many-to-one',
      target: 'Location',
      inverseSide: 'children',
      joinColumn: { name: 'parentId' },
    },
  },
});
