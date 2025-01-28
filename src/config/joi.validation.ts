import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  PORT: Joi.number().default(8000),
  MONGODB_URL: Joi.required(),
  PAGINATION_DEFAULT_LIMIT: Joi.number().default(5),
  PAGINATION_DEFAULT_OFFSET: Joi.number().default(0),
});
