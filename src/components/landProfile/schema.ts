import Joi from 'joi';
import { tokens } from '../../constants/acceptedTokens';

const decimalValidation = (schema: Joi.NumberSchema) => {
  let newSchema = schema;
  for (const token of tokens) {
    newSchema = newSchema.when('rentToken', {
      is: token.symbol,
      then: Joi.number().precision(token.decimals).positive().required(),
    });
  }
  return newSchema;
};

export const EditLeaseSchema = {
  rentToken: Joi.string()
    .valid(...tokens.map((token) => token.symbol))
    .required(),
  rentAmount: decimalValidation(Joi.number().positive().required()),
  deposit: decimalValidation(Joi.number().positive().required()),
  gracePeriod: Joi.number().positive().min(7).integer().required(),
  minLeaseLength: Joi.number().min(1).integer().required(),
  maxLeaseLength: Joi.number().when('minLeaseLength', {
    is: Joi.exist(),
    then: Joi.number().greater(Joi.ref('minLeaseLength')).integer().required(),
  }),
  autoRegenerate: Joi.bool().required(),
};
