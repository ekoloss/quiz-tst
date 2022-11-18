import { Module } from '@nestjs/common';
import { ObjectionModule } from 'nestjs-objection';

import { configModule } from '@app/utils';
import { AccountOrm, GroupOrm, AccountGroupsOrm } from '@app/orm';

import { GroupService } from './group.service';
import { GroupController } from './group.controller';

@Module({
  providers: [GroupService],
  exports: [GroupService],
  controllers: [GroupController],
  imports: [
    configModule(),
    ObjectionModule.forFeature([GroupOrm, AccountOrm, AccountGroupsOrm]),
  ],
})
export class GroupModule {}
