import * as Joi from 'joi';
import {
  IAccountChangePasswordBody,
  IAccountCreateBody,
  IAccountDeleteParams,
  IAccountGetByIdParams,
  IAccountGetListQuery,
  IAccountResetPasswordBody,
  IAccountRole,
  IAccountUpdateBody,
  IAccountUpdateParams,
  sortFields,
} from '@models';
import {
  defaultPagination,
  idSchema,
  paginateSchema,
  sortSchema,
  ValidatorPipe,
} from '@app/utils';

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
          superAdmin: Joi.boolean().required(),
          admin: Joi.boolean().required(),
          user: Joi.boolean().required(),
        }),
        ...loginSchema(),
        ...passwordSchema(),
      }).required(),
    ),
  },
  update: {
    body: new ValidatorPipe<IAccountUpdateBody>(
      Joi.object<IAccountUpdateBody>(loginSchema()).required(),
    ),
    param: new ValidatorPipe<IAccountUpdateParams>(
      Joi.object<IAccountUpdateParams>({
        id: idSchema().required(),
      }).required(),
    ),
  },
  resetPassword: {
    body: new ValidatorPipe<IAccountResetPasswordBody>(
      Joi.object<IAccountResetPasswordBody>(passwordSchema()).required(),
    ),
    param: new ValidatorPipe<IAccountUpdateParams>(
      Joi.object<IAccountUpdateParams>({
        id: idSchema().required(),
      }).required(),
    ),
  },
  changePassword: {
    body: new ValidatorPipe<IAccountChangePasswordBody>(
      Joi.object<IAccountChangePasswordBody>({
        oldPassword: passwordRuleSchema(),
        ...passwordSchema(),
      }).required(),
    ),
  },
  getById: {
    param: new ValidatorPipe<IAccountGetByIdParams>(
      Joi.object<IAccountGetByIdParams>({
        id: idSchema().required(),
      }).required(),
    ),
  },
  delete: {
    param: new ValidatorPipe<IAccountDeleteParams>(
      Joi.object<IAccountDeleteParams>({
        id: idSchema().required(),
      }).required(),
    ),
  },
  login: {
    body: new ValidatorPipe<IAccountCreateBody>(
      Joi.object<IAccountCreateBody>({
        password: passwordRuleSchema(),
        ...loginSchema(),
      }).required(),
    ),
  },
  getList: {
    query: new ValidatorPipe<IAccountGetListQuery>(
      Joi.object<IAccountGetListQuery>({
        login: Joi.string().min(3),
        start_date: Joi.date().max('now'),
        end_date: Joi.date().min(Joi.ref('start_date')),
        ...paginateSchema(),
        ...sortSchema<sortFields>(['login', 'last_login', 'created_at']),
      }).default({
        ...defaultPagination(),
      }),
    ),
  },
};
