import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityChangeSchema } from './schemas/entity-change.schema';
import { EntityPropertyChangeSchema } from './schemas/entity-property-change.schema';
import { EntityChangeSubscriber } from './subscribers/entity-change.subscriber';
@Module({
  imports: [
    TypeOrmModule.forFeature([EntityChangeSchema, EntityPropertyChangeSchema]),
  ],
  providers: [EntityChangeSubscriber],
})
export class AuditLoggingModule {}
