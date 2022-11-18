import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { groupValidation } from './validate';
import {
  IAccountAddGroupsParams,
  IGroupCreateBody,
  IGroupGetListQuery,
  IGroupIdentity,
  IGroupIdentityList,
  IGroupModel,
  IGroupUpdateBody,
} from '@models';
import { Auth, AuthGuard } from '@app/auth';
import { apiPrefix } from '@app/utils';

@Controller(`${apiPrefix}/group`)
@UseGuards(AuthGuard)
export class GroupController {
  constructor(private readonly service: GroupService) {}

  @Post()
  @Auth({ role: ['admin'] })
  createGroup(
    @Body(groupValidation.create.body) body: IGroupCreateBody,
  ): Promise<IGroupModel> {
    return this.service.createGroup(body);
  }

  @Put('/update/:id')
  @Auth({ role: ['admin'] })
  updateGroup(
    @Param(groupValidation.update.param) param: IGroupIdentity,
    @Body(groupValidation.update.body) body: IGroupUpdateBody,
  ): Promise<IGroupModel> {
    return this.service.updateGroup(param, body);
  }

  @Delete('/delete/:id')
  @Auth({ role: ['admin'] })
  deleteGroup(
    @Param(groupValidation.delete.param) param: IGroupIdentity,
  ): Promise<IGroupModel> {
    return this.service.deleteGroup(param);
  }

  @Get('/list')
  @Auth({ role: ['admin'] })
  getGroupList(
    @Query(groupValidation.getList.query) query: IGroupGetListQuery,
  ): Promise<IGroupModel[]> {
    return this.service.getList(query);
  }

  @Get('/:id')
  @Auth({ role: ['admin'] })
  getGroupById(
    @Param(groupValidation.getById.param) param: IGroupIdentity,
  ): Promise<IGroupModel> {
    return this.service.getById(param);
  }

  @Put('/add/account/:id/')
  @Auth({ role: ['admin'] })
  addGroup(
    @Param(groupValidation.addGroup.param) param: IAccountAddGroupsParams,
    @Body(groupValidation.addGroup.body) body: IGroupIdentityList,
  ): Promise<IGroupModel[]> {
    return this.service.addGroups(param, body);
  }
}
