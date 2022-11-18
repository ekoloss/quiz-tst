import * as Joi from 'joi';

import {
  ITemplateCreateBody,
  ITemplateDeleteParam,
  ITemplateGetByIdParam,
  ITemplateGetListQuery,
  ITemplateUpdateBody,
  ITemplateUpdateParam,
  templateSortFields,
} from '@models';
import {
  defaultPagination,
  idSchema,
  paginateSchema,
  sortSchema,
  ValidatorPipe,
} from '@app/utils';

const nameSchema = () => ({
  name: Joi.string().required().min(5),
});

export const templateValidation = {
  create: {
    body: new ValidatorPipe<ITemplateCreateBody>(
      Joi.object<ITemplateCreateBody>({
        ...nameSchema(),
      }).required(),
    ),
  },
  update: {
    body: new ValidatorPipe<ITemplateUpdateBody>(
      Joi.object<ITemplateUpdateBody>({
        ...nameSchema(),
      }).required(),
    ),
    param: new ValidatorPipe<ITemplateUpdateParam>(
      Joi.object<ITemplateUpdateParam>({
        id: idSchema().required(),
      }).required(),
    ),
  },
  getById: {
    param: new ValidatorPipe<ITemplateGetByIdParam>(
      Joi.object<ITemplateGetByIdParam>({
        id: idSchema().required(),
      }).required(),
    ),
  },
  getList: {
    query: new ValidatorPipe<ITemplateGetListQuery>(
      Joi.object<ITemplateGetListQuery>({
        name: Joi.string().min(3),
        created_at_start_date: Joi.date().max('now'),
        created_at_end_date: Joi.date().min(Joi.ref('created_at_start_date')),
        last_interview_start_date: Joi.date().max('now'),
        last_interview_end_date: Joi.date().min(
          Joi.ref('last_interview_start_date'),
        ),
        last_interview_null: Joi.boolean(),
        ...paginateSchema(),
        ...sortSchema<templateSortFields>([
          'name',
          'created_at',
          'last_interview',
          'interview_count',
        ]),
      }).default({
        ...defaultPagination(),
      }),
    ),
  },
  delete: {
    param: new ValidatorPipe<ITemplateDeleteParam>(
      Joi.object<ITemplateDeleteParam>({
        id: idSchema().required(),
      }).required(),
    ),
  },
};
