import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import {
  BaseEntity,
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  ObjectLiteral,
  RemoveEvent,
  Repository,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  AUDITED_METADATA_KEY,
  DISABLE_AUDITING_METADATA_KEY,
} from '../../../core/audit-logging/audit.metadatas';
import { EntityChangeActorDetector } from '../../../core/audit-logging/entity-change-actor-detector';
import { EntityChange } from '../entities/entity-change';
import { EntityPropertyChange } from '../entities/entity-property-change';
import { eChangeType } from '../enums/change-type.enum';

type EntityWithConstructor = ObjectLiteral & {
  constructor: Function;
};

@Injectable()
export class EntityChangeSubscriber implements EntitySubscriberInterface {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    @InjectRepository(EntityChange)
    private readonly entityChangeRepository: Repository<EntityChange>,
    private readonly actorDetector: EntityChangeActorDetector,
  ) {
    dataSource.subscribers.push(this);
  }

  public async afterInsert(event: InsertEvent<EntityWithConstructor>) {
    if (event.entity && this.shouldProcessEvent(event.entity)) {
      await this.createEntityChange(eChangeType.Created, event.entity);
    }
  }

  public async afterUpdate(event: UpdateEvent<EntityWithConstructor>) {
    if (
      event.databaseEntity &&
      event.entity &&
      this.shouldProcessEvent(event.entity)
    ) {
      await this.createEntityChange(
        eChangeType.Updated,
        event.entity,
        event.databaseEntity,
      );
    }
  }

  public async afterSoftRemove(event: SoftRemoveEvent<EntityWithConstructor>) {
    if (event.entity && this.shouldProcessEvent(event.entity)) {
      await this.createEntityChange(eChangeType.Deleted, event.entity);
    }
  }

  public async afterRemove(event: RemoveEvent<EntityWithConstructor>) {
    if (event.entity && this.shouldProcessEvent(event.entity)) {
      await this.createEntityChange(eChangeType.Deleted, event.entity);
    }
  }

  private shouldProcessEvent(entity: EntityWithConstructor): boolean {
    const isAudited = Reflect.getMetadata(
      AUDITED_METADATA_KEY,
      entity.constructor,
    );
    return isAudited;
  }

  private shouldAuditProperty(
    entity: EntityWithConstructor,
    propertyName: string,
  ): boolean {
    const isDisabled = Reflect.getMetadata(
      DISABLE_AUDITING_METADATA_KEY,
      entity.constructor,
      propertyName,
    );
    return !isDisabled;
  }

  private async createEntityChange(
    changeType: eChangeType,
    entity: EntityWithConstructor,
    oldEntity?: EntityWithConstructor,
  ): Promise<void> {
    const { actorId, actorType } = this.actorDetector.detectActor();

    const entityChangeId = uuidv4();

    const propertyChanges =
      changeType === eChangeType.Deleted
        ? []
        : this.createPropertyChanges(entityChangeId, entity, oldEntity);

    const entityChange = EntityChange.create({
      id: entityChangeId,
      entityName: entity.constructor.name,
      entityId:
        entity instanceof BaseEntity
          ? `${(entity.constructor as typeof BaseEntity).getId(entity)}`
          : `${entity.id}`,
      changeType,
      changeTime: new Date(),
      correlationId: uuidv4(),
      actorId,
      actorType,
      propertyChanges,
    });

    await this.entityChangeRepository.save(entityChange);
  }

  private createPropertyChanges(
    entityChangeId: string,
    entity: EntityWithConstructor,
    oldEntity?: EntityWithConstructor,
  ): EntityPropertyChange[] {
    const changes: EntityPropertyChange[] = [];

    const auditProperties = new Set([
      'creator',
      'creationTime',
      'lastModifier',
      'lastModificationTime',
      'deleter',
      'deletionTime',
    ]);

    const allKeys = new Set([
      ...(oldEntity ? Object.keys(oldEntity) : []),
      ...Object.keys(entity),
    ]);

    allKeys.forEach((propertyName) => {
      if (
        !auditProperties.has(propertyName) &&
        this.shouldAuditProperty(entity, propertyName)
      ) {
        const oldValue = oldEntity?.[propertyName];
        const newValue = entity[propertyName];

        if (!this.equalsCompare(oldValue, newValue)) {
          const change = EntityPropertyChange.create({
            id: uuidv4(),
            propertyName,
            oldValue: this.stringifyAny(oldValue),
            newValue: this.stringifyAny(newValue),
            entityChangeId,
          });
          changes.push(change);
        }
      }
    });

    return changes;
  }

  private equalsCompare(obj1: any, obj2: any): boolean {
    if (obj1 == null && obj2 == null) {
      return true;
    }
    if (Buffer.isBuffer(obj1) && Buffer.isBuffer(obj2)) {
      return this.getHash(obj1) === this.getHash(obj2);
    }
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  private stringifyAny(value: any): string | null | undefined {
    if (value === null || value === undefined) {
      return value;
    }
    if (Buffer.isBuffer(value)) {
      return this.getHash(value);
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (typeof value.toString === 'function') {
      return value.toString();
    }
    return JSON.stringify(value);
  }

  private getHash(data: Buffer): string {
    const hash = createHash('sha256');
    hash.update(data);
    return hash.digest('hex').toUpperCase();
  }
}
