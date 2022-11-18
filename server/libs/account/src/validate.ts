import * as Joi from 'joi';
import {
  IAccountChangePasswordBody,
  IAccountCreateBody,
  IAccountDeleteParams,
  IAccountGetByIdParams,
  IAccountResetPasswordBody,
  IAccountRole,
  IAccountUpdateBody,
  IAccountUpdateParams,
} from '@models';
import { idSchema, ValidatorPipe } from '@app/utils';

const loginSchema = () => ({
  login: Joi.string().required().min(5),
});

const passwordRuleSchema = (): Joi.StringSchema =>
  Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*\d).*$/)
    .pattern(/^(?=.*\p{Ll}).*$/u)
    .pattern(/^(?=.*\p{Lu}).*$/u)
    .pattern(/^(?=.*[\W_]).*$/);

const passwordSchema = () => ({
  passwordConfirm: Joi.string().valid(Joi.ref('password')),
  password: passwordRuleSchema(),
});

export const accountValidation = {
  create: {
    body: new ValidatorPipe<IAccountCreateBody>(
      Joi.object<IAccountCreateBody>({
        role: Joi.object<IAccountRole>({
          superAdmin: Joi.boolean().required().valid(false),
          admin: Joi.boolean().required(),
          user: Joi.boolean().required(),
        }),
      })
        .keys(loginSchema())
        .keys(passwordSchema()),
    ),
  },
  update: {
    body: new ValidatorPipe<IAccountUpdateBody>(
      Joi.object<IAccountUpdateBody>().keys(loginSchema()),
    ),
    param: new ValidatorPipe<IAccountUpdateParams>(
      Joi.object<IAccountUpdateParams>({
        id: idSchema().required(),
      }),
    ),
  },
  resetPassword: {
    body: new ValidatorPipe<IAccountResetPasswordBody>(
      Joi.object<IAccountResetPasswordBody>(passwordSchema()),
    ),
    param: new ValidatorPipe<IAccountUpdateParams>(
      Joi.object<IAccountUpdateParams>({
        id: idSchema().required(),
      }),
    ),
  },
  changePassword: {
    body: new ValidatorPipe<IAccountChangePasswordBody>(
      Joi.object<IAccountChangePasswordBody>({
        oldPassword: passwordRuleSchema(),
      }).keys(passwordSchema()),
    ),
  },
  getById: {
    param: new ValidatorPipe<IAccountGetByIdParams>(
      Joi.object<IAccountGetByIdParams>({
        id: idSchema().required(),
      }),
    ),
  },
  delete: {
    param: new ValidatorPipe<IAccountDeleteParams>(
      Joi.object<IAccountDeleteParams>({
        id: idSchema().required(),
      }),
    ),
  },
  login: {
    body: new ValidatorPipe<IAccountCreateBody>(
      Joi.object<IAccountCreateBody>({
        password: passwordRuleSchema(),
      }).keys(loginSchema()),
    ),
  },
};
