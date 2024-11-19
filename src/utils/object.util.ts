import { isByteArray } from './array.util';

export const createRecursiveObject = (
  propPath: string[],
  value: string,
  recursiveObj: object,
  index = 0,
): object => {
  for (let pathIndex = index; pathIndex < propPath.length; pathIndex++) {
    const path = propPath[pathIndex];
    if (pathIndex === propPath.length - 1) {
      (recursiveObj[path as keyof typeof recursiveObj] as any) = value;
    } else {
      (recursiveObj[path as keyof typeof recursiveObj] as any) =
        (recursiveObj[path as keyof typeof recursiveObj] as any) ?? {};
      createRecursiveObject(
        propPath,
        value,
        recursiveObj[path as keyof typeof recursiveObj] as any,
        pathIndex + 1,
      );
      break;
    }
  }
  return recursiveObj;
};

export const mergeObject = <T extends object, V extends T>(
  obj1: T,
  obj2: T | V | Partial<V>,
  assign = false,
): V => {
  const mergeObj = assign ? recursiveAssign(obj1) : obj1;
  const destinationObj = assign ? recursiveAssign(obj2) : obj2;

  for (const key in destinationObj) {
    const oldValue = mergeObj[key as keyof typeof mergeObj];
    const newValue = destinationObj[key as keyof typeof destinationObj];
    if (
      typeof oldValue === 'object' &&
      isByteArray(oldValue) === false &&
      typeof newValue === 'object'
    ) {
      mergeObj[key as keyof typeof mergeObj] = mergeObject(
        oldValue!,
        newValue!,
      );
    } else {
      mergeObj[key as keyof typeof mergeObj] = newValue as any;
    }
  }

  return <V>mergeObj;
};

export const recursiveAssign = <T extends object>(obj: T): T => {
  if (isByteArray(obj)) {
    return obj;
  }
  const assignObj = Array.isArray(obj) ? [...obj] : { ...obj };
  for (const key in assignObj) {
    const value: any = assignObj[key as keyof typeof assignObj];
    if (typeof value === 'object') {
      assignObj[key as keyof typeof assignObj] = recursiveAssign(value);
    }
  }
  return <T>assignObj;
};

export const getObjectProp = <T extends object, K extends keyof T>(
  obj: T,
  prop: K,
  defaultValue?: T[K],
): T[K] => (obj && obj[prop]) || defaultValue!;

export const isObjectProp = <T extends object>(
  obj: T,
  prop: string | number | symbol,
): prop is keyof T => prop in obj;

export const isEmptyObject = (obj: any): boolean => {
  if (typeof obj === 'object') {
    return Object.keys(obj).length === 0;
  } else {
    return false;
  }
};
