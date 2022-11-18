import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { GroupService } from './group.service';
import {
  groupCreateBodyValidation,
  groupGetListBodyValidation,
  groupIdentityBodyValidation,
  groupUpdateBodyValidation,
} from './validate';
import {
  IGroupCreateBody,
  IGroupGetListBody,
  IGroupIdentity,
  IGroupModel,
  IGroupUpdateBody,
} from '@models';

@Controller('group')
export class GroupController {
  constructor(private readonly service: GroupService) {}

  @Post()
  createGroup(
    @Body(groupCreateBodyValidation) body: IGroupCreateBody,
  ): Promise<IGroupModel> {
    return this.service.createGroup(body);
  }

  @Post('/update')
  updateGroup(
    @Body(groupUpdateBodyValidation) body: IGroupUpdateBody,
  ): Promise<IGroupModel> {
    return this.service.updateGroup(body);
  }

  @Post('/delete')
  deleteGroup(
    @Body(groupIdentityBodyValidation) body: IGroupIdentity,
  ): Promise<IGroupModel> {
    return this.service.deleteGroup(body);
  }

  @Get('/list')
  getGroupList(
    @Query(groupGetListBodyValidation) query: IGroupGetListBody,
  ): Promise<IGroupModel[]> {
    return this.service.getList(query);
  }

  @Get('/:id')
  getGroupById(
    @Param(groupIdentityBodyValidation) param: IGroupIdentity,
  ): Promise<IGroupModel> {
    return this.service.getById(param);
  }
}
