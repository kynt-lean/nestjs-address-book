import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { EntityChangeActorDetector } from '../../../core/audit-logging/entity-change-actor-detector';

type EntityWithAuditFields = {
  creator?: string;
  creationTime?: Date;
  lastModifier?: string;
  lastModificationTime?: Date;
  deleter?: string;
};

@Injectable()
export class AuditSetterSubscriber implements EntitySubscriberInterface {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly actorDetector: EntityChangeActorDetector,
  ) {
    dataSource.subscribers.push(this);
  }

  private hasAuditFields(entity: any, auditFields: string[]): boolean {
    const entityMetadata = this.dataSource.getMetadata(entity.constructor);
    return auditFields.some((column) =>
      entityMetadata.findColumnWithPropertyName(column),
    );
  }

  public beforeInsert(event: InsertEvent<EntityWithAuditFields>) {
    const { actorId } = this.actorDetector.detectActor();
    if (
      event.entity &&
      this.hasAuditFields(event.entity, ['creator', 'creationTime'])
    ) {
      event.entity.creator = actorId;
      event.entity.creationTime = new Date();
    }
  }

  public beforeUpdate(event: UpdateEvent<EntityWithAuditFields>) {
    const { actorId } = this.actorDetector.detectActor();
    if (
      event.entity &&
      this.hasAuditFields(event.entity, [
        'lastModifier',
        'lastModificationTime',
      ])
    ) {
      event.entity.lastModifier = actorId;
      event.entity.lastModificationTime = new Date();
    }
  }

  public beforeSoftRemove(event: SoftRemoveEvent<EntityWithAuditFields>) {
    const { actorId } = this.actorDetector.detectActor();
    if (event.entity && this.hasAuditFields(event.entity, ['deleter'])) {
      event.entity.deleter = actorId;
    }
  }
}
