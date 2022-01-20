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

export const getCoordinatesFromUrl = (metaverseName: string, url: string): L.LatLngExpression => {
  switch (metaverseName) {
    case 'Cryptovoxels': {
      const matchX = url.match(/x=([+-]?([0-9]*[.])?[0-9]+)/);
      const matchY = url.match(/&y=([+-]?([0-9]*[.])?[0-9]+)/);
      if (!matchX || !matchY) {
        // to add error handler
        return [0, 0];
      }
      return [parseFloat(matchY[1]), parseFloat(matchX[1])];
    }
    case 'Decentraland': {
      const match = url.match(/parcels\/([+-]?([0-9]*[.])?[0-9]+)\/([+-]?([0-9]*[.])?[0-9]+)/);
      if (!match) {
        // to add error handler
        return [0, 0];
      }
      return [parseFloat(match[3]) * 5, parseFloat(match[1]) * 5];
    }

    case 'Sandbox': {
      const matchX = url.match(/\(([+-]?([0-9]*[.])?[0-9]+)/);
      const matchY = url.match(/, ([+-]?([0-9]*[.])?[0-9]+)/);
      if (!matchX || !matchY) {
        // to add error handler
        return [0, 0];
      }
      return [parseFloat(matchY[1]) * (3 / 2), parseFloat(matchX[1]) * (3 / 2)];
    }
    case 'Somnium Space VR': {
      const matchX = url.match(/X = ([+-]?([0-9]*[.])?[0-9]+)/);
      const matchY = url.match(/Z = ([+-]?([0-9]*[.])?[0-9]+)/);
      if (!matchX || !matchY) {
        // to add error handler
        return [0, 0];
      }
      return [(parseFloat(matchY[1]) + 202.167) / 23, (parseFloat(matchX[1]) - 576.433) / 22.7356];
    }
    default: {
      return [0, 0];
    }
  }
};
