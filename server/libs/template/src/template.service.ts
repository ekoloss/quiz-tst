import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-objection';
import { startOfDay, endOfDay } from 'date-fns';

import {
  IPaginateResult,
  ITemplateCreateBody,
  ITemplateDeleteParam,
  ITemplateGetByIdParam,
  ITemplateGetListQuery,
  ITemplateResponse,
  ITemplateUpdateBody,
  ITemplateUpdateParam,
} from '@models';
import { TemplateOrm } from '@app/orm';

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(TemplateOrm)
    private readonly templateModel: typeof TemplateOrm,
  ) {}

  create(body: ITemplateCreateBody): Promise<ITemplateResponse> {
    return this.templateModel.query().insertAndFetch(body);
  }

  async update(
    { id }: ITemplateUpdateParam,
    body: ITemplateUpdateBody,
  ): Promise<ITemplateResponse> {
    const template = await this.templateModel
      .query()
      .where('is_deleted', false)
      .updateAndFetchById(id, {
        ...body,
        updated_at: new Date().toISOString(),
      });

    if (!template) {
      throw new NotFoundException();
    }

    return template;
  }

  async delete({ id }: ITemplateDeleteParam): Promise<ITemplateResponse> {
    const template = await this.templateModel
      .query()
      .where('is_deleted', false)
      .updateAndFetchById(id, {
        is_deleted: true,
        updated_at: new Date().toISOString(),
      });

    if (!template) {
      throw new NotFoundException();
    }

    return template;
  }

  async getById({ id }: ITemplateGetByIdParam): Promise<ITemplateResponse> {
    const template = await this.templateModel
      .query()
      .where('is_deleted', false)
      .findById(id);

    if (!template) {
      throw new NotFoundException();
    }

    return template;
  }

  async getList({
    page,
    page_size,
    sort_by,
    sort_order,
    name,
    last_interview_start_date,
    last_interview_end_date,
    last_interview_null,
    created_at_start_date,
    created_at_end_date,
  }: ITemplateGetListQuery): Promise<IPaginateResult<ITemplateResponse>> {
    const query = this.templateModel
      .query()
      .where('is_deleted', false)
      .page(page, page_size);

    if (sort_by && sort_order) {
      query.orderBy(sort_by, sort_order);
    }

    if (name) {
      query.where('name', 'ilike', `%${name}%`);
    }

    if (last_interview_start_date) {
      query.where(
        'last_interview',
        '>',
        startOfDay(new Date(last_interview_start_date)).toISOString(),
      );
    }

    if (last_interview_end_date) {
      query.where(
        'last_interview',
        '<',
        endOfDay(new Date(last_interview_end_date)).toISOString(),
      );
    }

    if (typeof last_interview_null === 'boolean') {
      if (last_interview_null) {
        query.whereNull('last_interview');
      } else {
        query.whereNotNull('last_interview');
      }
    }

    if (created_at_start_date) {
      query.where(
        'created_at',
        '>',
        startOfDay(new Date(created_at_start_date)).toISOString(),
      );
    }

    if (created_at_end_date) {
      query.where(
        'created_at',
        '<',
        endOfDay(new Date(created_at_end_date)).toISOString(),
      );
    }

    return query.debug();
  }
}
