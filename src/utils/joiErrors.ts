import Joi from 'joi';
import { camelToText } from './utils';

export const parseError = (error: Joi.ValidationError) => {
  switch (error.details[0].type) {
    case 'number.integer': {
      return 'Please enter an integer.';
    }
    case 'number.base': {
      return 'Please enter a number.';
    }
    case 'number.precision': {
      if (!error.details[0].context) {
        return;
      }
      const limit = error.details[0].context.limit;
      return `Please enter a number with decimal places fewer than ${limit}.`;
    }
    case 'number.min': {
      if (!error.details[0].context) {
        return;
      }
      const min = error.details[0].context.limit;
      return `Please enter a number greater than or equal to ${min}.`;
    }
    case 'number.positive': {
      if (!error.details[0].context) {
        return;
      }
      return `Please enter a positive number.`;
    }
    case 'number.greater': {
      if (!error.details[0].context || !error.details[0].context.limit) {
        return;
      }
      const field = error.details[0].context.limit.key;
      return `Please enter a number greater than ${camelToText(field)}`;
    }
    default: {
      return '';
    }
  }
};
