import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { CurrentUserService } from '../authentication/current-user.service';
import { eActorType } from './actor-type.enum';
import { IActor } from './actor.interface';

@Injectable()
export class EntityChangeActorDetector {
  constructor(
    private readonly currentUserService: CurrentUserService,
    private readonly cls: ClsService,
  ) {}

  public detectActor(): IActor {
    const currentUser = this.currentUserService.getCurrentUser();
    const actorId = currentUser?.userId || currentUser?.appId;
    if (actorId) {
      const actorType = currentUser.userId ? eActorType.User : eActorType.App;
      return { actorId, actorType };
    }
    const entityChangeActor = this.getEntityChangeActor();
    if (entityChangeActor) {
      return entityChangeActor;
    }
    throw new Error('No entity change actor detected.');
  }

  public setEntityChangeActor(actor: IActor) {
    this.cls.set('entityChangeActor', actor);
  }

  public getEntityChangeActor(): IActor | undefined {
    return this.cls.get('entityChangeActor');
  }
}
