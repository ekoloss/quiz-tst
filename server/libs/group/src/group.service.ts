import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-objection';
import { AccountOrm, GroupOrm, AccountGroupsOrm } from '@app/orm';
import {
  IAccountAddGroupsParams,
  IGroupCreateBody,
  IGroupGetListQuery,
  IGroupIdentity,
  IGroupIdentityList,
  IGroupModel,
  IGroupUpdateBody,
} from '@models';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(GroupOrm) private readonly groupModel: typeof GroupOrm,
    @InjectModel(AccountOrm) private readonly accountModel: typeof AccountOrm,
    @InjectModel(AccountGroupsOrm)
    private readonly accountGroupsModel: typeof AccountGroupsOrm,
  ) {}

  createGroup({ name }: IGroupCreateBody): Promise<IGroupModel> {
    return this.groupModel.query().insertAndFetch({ name });
  }

  updateGroup(
    { id }: IGroupIdentity,
    { name }: IGroupUpdateBody,
  ): Promise<IGroupModel> {
    return this.groupModel.query().patchAndFetchById(id, {
      name,
      updated_at: new Date().toISOString(),
    });
  }

  async deleteGroup({ id }: IGroupIdentity): Promise<IGroupModel> {
    const group = await this.groupModel
      .query()
      .findById(id)
      .where('is_deleted', false);
    if (!group) {
      throw new NotFoundException();
    }

    const groupAccounts = await this.accountGroupsModel
      .query()
      .where('group_id', id);
    if (groupAccounts) {
      throw new BadRequestException();
    }

    return this.groupModel.query().patchAndFetchById(id, {
      is_deleted: true,
      updated_at: new Date().toISOString(),
    });
  }

  getList(query?: IGroupGetListQuery): Promise<IGroupModel[]> {
    const qb = this.groupModel.query().where('is_deleted', false);
    if (query?.name) {
      qb.where('name', 'ilike', `%${query.name}%`);
    }
    qb.page(query.page, query.page_size);
    return qb;
  }

  getById({ id }: IGroupIdentity): Promise<IGroupModel> {
    return this.groupModel.query().findById(id);
  }

  async addGroups(
    { id }: IAccountAddGroupsParams,
    { groups }: IGroupIdentityList,
  ): Promise<IGroupModel[]> {
    const account = await this.accountModel
      .query()
      .findById(id)
      .where('is_deleted', false);

    if (!account) {
      throw new NotFoundException();
    }

    const groupList = await this.groupModel
      .query()
      .select('id', 'name')
      .where('is_deleted', false)
      .andWhere('id', 'in', groups);

    if (groupList.length != groups.length) {
      throw new BadRequestException();
    }

    const insertData = [];
    groupList.map((item) => {
      insertData.push({
        account_id: account.id,
        group_id: item.id,
      });
    });

    await this.accountGroupsModel
      .query()
      .delete()
      .where('account_id', account.id);
    await this.accountGroupsModel.query().insertGraphAndFetch(insertData);
    return groupList;
  }
}
