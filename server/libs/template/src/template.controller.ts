import {
  Body,
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';

import { apiPrefix } from '@app/utils';
import { Auth, AuthGuard } from '@app/auth';
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

import { TemplateService } from './template.service';
import { templateValidation } from './validate';

@Controller(`${apiPrefix}/template`)
@UseGuards(AuthGuard)
@Auth({ role: ['admin'] })
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  create(
    @Body(templateValidation.create.body) body: ITemplateCreateBody,
  ): Promise<ITemplateResponse> {
    return this.templateService.create(body);
  }

  @Put(':id')
  update(
    @Param(templateValidation.update.param) param: ITemplateUpdateParam,
    @Body(templateValidation.update.body) body: ITemplateUpdateBody,
  ): Promise<ITemplateResponse> {
    return this.templateService.update(param, body);
  }

  @Get('list')
  getList(
    @Query(templateValidation.getList.query) query: ITemplateGetListQuery,
  ): Promise<IPaginateResult<ITemplateResponse>> {
    return this.templateService.getList(query);
  }

  @Get(':id')
  getById(
    @Param(templateValidation.getById.param) param: ITemplateGetByIdParam,
  ): Promise<ITemplateResponse> {
    return this.templateService.getById(param);
  }

  @Delete(':id')
  delete(
    @Param(templateValidation.delete.param) param: ITemplateDeleteParam,
  ): Promise<ITemplateResponse> {
    return this.templateService.delete(param);
  }
}
