import { EntitySchemaColumns } from '../../../core/database/entity-schema-columns';
import { ICreationAuditObject } from '../interfaces/creation-audit-object.interface';

export const CreationAuditSchemaColumns: EntitySchemaColumns<ICreationAuditObject> =
  {
    creator: { type: 'varchar', length: 256, name: 'creator', nullable: true },
    creationTime: { type: 'timestamp', name: 'creation_time', nullable: true },
  };
