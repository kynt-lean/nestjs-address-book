import { EntitySchemaColumns } from '../../../core/database/entity-schema-columns';
import { IModificationAuditObject } from '../interfaces/modification-audit-object.interface';

export const ModificationAuditSchemaColumns: EntitySchemaColumns<IModificationAuditObject> =
  {
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
  };
