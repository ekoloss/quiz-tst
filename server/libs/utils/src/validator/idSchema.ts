import * as Joi from 'joi';

export const idSchema = (): Joi.StringSchema =>
  Joi.string().uuid({ version: ['uuidv4', 'uuidv5'] });
