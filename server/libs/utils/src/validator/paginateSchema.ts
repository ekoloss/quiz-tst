import * as Joi from 'joi';
import { IPaginate } from '@models';
import { defaultPageSize } from '@app/utils';

export const paginateSchema = ({ pageSize = defaultPageSize, page = 0 } = {}): {
  page: Joi.NumberSchema;
  page_size: Joi.NumberSchema;
} => ({
  page: Joi.number().integer().default(page).min(0),
  page_size: Joi.number().integer().default(pageSize).min(1),
});

export const defaultPagination = ({
  pageSize = defaultPageSize,
  page = 0,
} = {}): IPaginate => ({
  page_size: pageSize,
  page,
});
