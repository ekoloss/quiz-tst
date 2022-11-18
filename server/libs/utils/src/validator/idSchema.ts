import * as Joi from 'joi';

export const idSchema = () =>
  Joi.string().uuid({ version: ['uuidv4', 'uuidv5'] });
