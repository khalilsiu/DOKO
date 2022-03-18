import Joi from 'joi';
import { tokens } from '../../constants/acceptedTokens';
import { ethers } from 'ethers';

const decimalValidation = (schema: Joi.StringSchema) => {
  let newSchema = schema;
  for (const token of tokens) {
    newSchema = newSchema.when('rentToken', {
      is: token.symbol,
      then: Joi.string().custom((value, helpers) => {
        try {
          ethers.utils.parseUnits(value, token.decimals);
          return value;
        } catch (e) {
          console.warn(`${token.symbol} allows max decimals of ${token.decimals}`);
          return helpers.error('number.precision', { limit: token.decimals });
        }
      }),
      otherwise: Joi.string().required(),
    });
  }
  return newSchema;
};

export const EditLeaseSchema = {
  rentToken: Joi.string()
    .valid(...tokens.map((token) => token.symbol))
    .required(),
  rentAmount: decimalValidation(Joi.string()),
  deposit: decimalValidation(Joi.string()),
  gracePeriod: Joi.number().positive().min(7).integer().required(),
  minLeaseLength: Joi.number().min(1).integer().required(),
  maxLeaseLength: Joi.number().when('minLeaseLength', {
    is: Joi.exist(),
    then: Joi.number().greater(Joi.ref('minLeaseLength')).integer().required(),
    otherwise: Joi.number().positive().integer().required(),
  }),
  autoRegenerate: Joi.bool().required(),
};
