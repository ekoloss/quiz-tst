import * as Joi from 'joi';
import { IAccountCreateBody, IAccountRole } from '@models';
import { ValidatorPipe } from '@app/utils';

export const accountCreateBodyValidation =
  new ValidatorPipe<IAccountCreateBody>(
    Joi.object<IAccountCreateBody>({
      login: Joi.string().required().min(5),
      password: Joi.string()
        .required()
        .min(8)
        .pattern(/^(?=.*\d).*$/)
        .pattern(/^(?=.*\p{Ll}).*$/u)
        .pattern(/^(?=.*\p{Lu}).*$/u)
        .pattern(/^(?=.*[\W_]).*$/),
      role: Joi.object<IAccountRole>({
        superAdmin: Joi.boolean().required().valid(false),
        admin: Joi.boolean().required(),
        user: Joi.boolean().required(),
      }),
      passwordConfirm: Joi.string().valid(Joi.ref('password')),
    }),
  );
