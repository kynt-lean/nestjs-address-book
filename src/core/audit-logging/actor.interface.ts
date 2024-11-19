import { eActorType } from './actor-type.enum';

export interface IActor {
  actorId: string;
  actorType: eActorType;
}
