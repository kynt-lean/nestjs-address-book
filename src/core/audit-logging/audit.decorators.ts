import { AUDITED_METADATA_KEY, DISABLE_AUDITING_METADATA_KEY } from './audit.metadatas';

export function Audited(): ClassDecorator & PropertyDecorator {
  return (target: Object, propertyKey?: string | symbol) => {
    if (propertyKey) {
      Reflect.defineMetadata(AUDITED_METADATA_KEY, true, target, propertyKey);
    } else {
      Reflect.defineMetadata(AUDITED_METADATA_KEY, true, target);
    }
  };
}

export function DisableAuditing(): ClassDecorator & PropertyDecorator {
  return (target: Object, propertyKey?: string | symbol) => {
    if (propertyKey) {
      Reflect.defineMetadata(DISABLE_AUDITING_METADATA_KEY, true, target, propertyKey);
    } else {
      Reflect.defineMetadata(DISABLE_AUDITING_METADATA_KEY, true, target);
    }
  };
}
