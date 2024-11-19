import { Module } from '@nestjs/common';
import { EntityChangeActorDetector } from './entity-change-actor-detector';

@Module({})
export class AuditLoggingCoreModule {
  public static forRoot() {
    return {
      module: AuditLoggingCoreModule,
      providers: [EntityChangeActorDetector],
      exports: [EntityChangeActorDetector],
      global: true,
    };
  }
}
