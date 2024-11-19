const iso8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/;

export const isIso8601 = (value: any): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  return iso8601.test(value);
};
