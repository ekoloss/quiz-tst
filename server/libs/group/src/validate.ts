import * as Joi from 'joi';
import {
  IAccountAddGroupsParams,
  IGroupCreateBody,
  IGroupGetListQuery,
  IGroupIdentity,
  IGroupIdentityList,
  IGroupUpdateBody,
} from '@models';
import {
  defaultPageSize,
  ValidatorPipe,
  defaultPage,
  idSchema,
} from '@app/utils';

const groupNameSchema = (limit = 5) => Joi.string().min(limit);

export const groupValidation = {
  create: {
    body: new ValidatorPipe<IGroupCreateBody>(
      Joi.object<IGroupCreateBody>({
        name: groupNameSchema().required(),
      }),
    ),
  },
  update: {
    body: new ValidatorPipe<IGroupUpdateBody>(
      Joi.object<IGroupUpdateBody>({
        name: groupNameSchema().required(),
      }),
    ),
    param: new ValidatorPipe<IGroupIdentity>(
      Joi.object<IGroupIdentity>({
        id: idSchema().required(),
      }),
    ),
  },
  delete: {
    param: new ValidatorPipe<IGroupIdentity>(
      Joi.object<IGroupIdentity>({
        id: idSchema().required(),
      }),
    ),
  },
  getById: {
    param: new ValidatorPipe<IGroupIdentity>(
      Joi.object<IGroupIdentity>({
        id: idSchema().required(),
      }),
    ),
  },
  getList: {
    query: new ValidatorPipe<IGroupGetListQuery>(
      Joi.object<IGroupGetListQuery>({
        name: groupNameSchema(3),
        page: Joi.number().default(defaultPage),
        page_size: Joi.number().default(defaultPageSize),
      }),
    ),
  },
  addGroup: {
    param: new ValidatorPipe<IAccountAddGroupsParams>(
      Joi.object<IAccountAddGroupsParams>({
        id: idSchema().required(),
      }),
    ),
    body: new ValidatorPipe<IGroupIdentityList>(
      Joi.object<IGroupIdentityList>({
        groups: Joi.array().items(idSchema()).required(),
      }),
    ),
  },
};
