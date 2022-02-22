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

export const camelToText = (camelCase: string) => {
  const result = camelCase.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const getCoordinates = (metaverseName: string, asset: any): L.LatLngExpression => {
  switch (metaverseName) {
    case 'Cryptovoxels': {
      const matchX = asset.image_original_url.match(/x=([+-]?([0-9]*[.])?[0-9]+)/);
      const matchY = asset.image_original_url.match(/&y=([+-]?([0-9]*[.])?[0-9]+)/);
      if (!matchX || !matchY) {
        // to add error handler
        return [0, 0];
      }
      return [parseFloat(matchY[1]), parseFloat(matchX[1])];
    }
    case 'Decentraland': {
      const match = asset.image_original_url.match(
        /parcels\/([+-]?([0-9]*[.])?[0-9]+)\/([+-]?([0-9]*[.])?[0-9]+)/,
      );
      if (!match) {
        // to add error handler
        return [0, 0];
      }
      return [parseFloat(match[3]) * 5, parseFloat(match[1]) * 5];
    }
    case 'The Sandbox': {
      const matchX = asset.name.match(/\(([+-]?([0-9]*[.])?[0-9]+)/);
      const matchY = asset.name.match(/, ([+-]?([0-9]*[.])?[0-9]+)/);
      if (!matchX || !matchY) {
        // to add error handler
        return [0, 0];
      }
      return [parseFloat(matchY[1]), parseFloat(matchX[1])];
    }
    case 'Somnium Space VR': {
      const matchX = asset.description.match(/X = ([+-]?([0-9]*[.])?[0-9]+)/);
      const matchY = asset.description.match(/Z = ([+-]?([0-9]*[.])?[0-9]+)/);
      if (!matchX || !matchY) {
        // to add error handler
        return [0, 0];
      }
      return [(parseFloat(matchY[1]) + 202.167) / 23, (parseFloat(matchX[1]) - 576.433) / 22.7356];
    }
    default: {
      return [NaN, NaN];
    }
  }
};
