import { Module } from '@nestjs/common';
import { ObjectionModule } from 'nestjs-objection';

import { TemplateOrm } from '@app/orm';
import { configModule } from '@app/utils';

import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';

@Module({
  imports: [ObjectionModule.forFeature([TemplateOrm]), configModule()],
  providers: [TemplateService],
  exports: [TemplateService],
  controllers: [TemplateController],
})
export class TemplateModule {}
