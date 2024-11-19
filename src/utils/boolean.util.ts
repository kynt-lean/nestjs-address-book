import { specialStringMapper } from './string.util';

export const toBoolean = (value: string): boolean => Boolean(specialStringMapper.get(value));
