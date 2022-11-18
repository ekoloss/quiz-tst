import { Module } from '@nestjs/common';
import { ObjectionModule } from 'nestjs-objection';
import { GroupOrm } from '@app/orm';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';

@Module({
  providers: [GroupService],
  exports: [GroupService],
  controllers: [GroupController],
  imports: [ObjectionModule.forFeature([GroupOrm])],
})
export class GroupModule {}
