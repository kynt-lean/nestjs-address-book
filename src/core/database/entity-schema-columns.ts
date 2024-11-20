import { EntitySchemaColumnOptions } from 'typeorm';
import { mergeObject } from '../../utils/object.util';

export type EntitySchemaColumns<T> = {
  [P in keyof T]?: EntitySchemaColumnOptions;
};

export const mergeEntitySchemaColumns = <B, D extends B>(
  schema: EntitySchemaColumns<B>,
  ...contributors: EntitySchemaColumns<D>[]
): EntitySchemaColumns<D> => {
  let mergeSchema: EntitySchemaColumns<D> = mergeObject(schema, {}, true);
  contributors.forEach(
    (contributor) =>
      (mergeSchema = mergeObject(mergeSchema, contributor, true)),
  );
  return mergeSchema;
};
