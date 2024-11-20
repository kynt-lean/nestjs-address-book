import { EntitySchemaColumns } from '../../../core/database/entity-schema-columns';
import { IDeletionAuditObject } from '../interfaces/deletion-audit-object.interface';

export const DeletionAuditSchemaColumns: EntitySchemaColumns<IDeletionAuditObject> =
  {
    deleter: { type: 'varchar', length: 256, name: 'deleter', nullable: true },
    deletionTime: {
      deleteDate: true,
      type: 'timestamp',
      name: 'deletion_time',
      nullable: true,
    },
  };
