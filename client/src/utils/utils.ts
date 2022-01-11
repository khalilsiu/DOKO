import { transform, isArray, camelCase, isDate, isObject, snakeCase } from 'lodash';

export const camelize = (obj: any) =>
  transform(obj, (acc: any, value, key, target) => {
    const camelKey = isArray(target) ? key : camelCase(key as string);
    if (isDate(value)) {
      acc[camelKey] = value;
    } else if (isObject(value)) {
      acc[camelKey] = camelize(value);
    } else {
      acc[camelKey] = value;
    }
  });

export const snakeize = (obj: any) =>
  transform(obj, (acc: any, value, key, target) => {
    const snakeKey = isArray(target) ? key : snakeCase(key as string);
    if (isDate(value)) {
      acc[snakeKey] = value;
    } else if (isObject(value)) {
      acc[snakeKey] = snakeize(value);
    } else {
      acc[snakeKey] = value;
    }
  });
