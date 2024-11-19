import { EntitySchema } from 'typeorm';
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
    creator: { type: 'varchar', length: 256, name: 'creator', nullable: true },
    creationTime: { type: 'timestamp', name: 'creation_time', nullable: true },
    lastModifier: {
      type: 'varchar',
      length: 256,
      name: 'last_modifier',
      nullable: true,
    },
    lastModificationTime: {
      type: 'timestamp',
      name: 'last_modification_time',
      nullable: true,
    },
    deleter: { type: 'varchar', length: 256, name: 'deleter', nullable: true },
    deletionTime: {
      deleteDate: true,
      type: 'timestamp',
      name: 'deletion_time',
      nullable: true,
    },
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
      joinColumn: { name: 'parentId' },
    },
  },
});
