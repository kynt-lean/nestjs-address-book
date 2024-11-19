import { toNumber } from './number.util';

export const objectToArray = (obj: any): any[] =>
  Array.isArray(obj) ? obj : obj ? [obj] : [];

export const sumArray = (arr: any[]): number =>
  arr.length > 0
    ? arr.reduce((a: any, b: any) => toNumber(a) + toNumber(b))
    : 0;

export const sameArray = <T>(arr1: Array<T>, arr2: Array<T>): boolean => {
  const sortedThis = arr1.slice().sort();
  const sortedTarget = arr2.slice().sort();
  return JSON.stringify(sortedThis) === JSON.stringify(sortedTarget);
};

export const isByteArray = (obj: any) => {
  if (Buffer.isBuffer(obj)) {
    return true;
  }

  if (obj instanceof Uint8Array) {
    return true;
  }

  if (obj instanceof ArrayBuffer) {
    return new Uint8Array(obj).every(
      (element) => element >= 0 && element <= 255,
    );
  }

  if (Array.isArray(obj)) {
    return obj.every(
      (element) =>
        typeof element === 'number' && element >= 0 && element <= 255,
    );
  }

  return false;
};
