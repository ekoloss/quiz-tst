import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const jwtConfig = registerAs('jwt', () => ({
  privateKey: process.env.JWT_PRIVATE_KEY,
  algorithm: process.env.JWT_ALGORITHM,
  expiresIn: process.env.JWT_EXPIRES_IN,
}));

export const jwtValidate = {
  JWT_PRIVATE_KEY: Joi.string().required().min(100),
  JWT_ALGORITHM: Joi.string().default('RS256'),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
};
