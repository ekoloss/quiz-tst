import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-objection';
import { GroupOrm } from '@app/orm';
import {
  IGroupCreateBody,
  IGroupGetListBody,
  IGroupIdentity,
  IGroupModel,
  IGroupUpdateBody,
} from '@models';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(GroupOrm) private readonly groupModel: typeof GroupOrm,
  ) {}

  createGroup(body: IGroupCreateBody): Promise<IGroupModel> {
    return this.groupModel.query().insertAndFetch({ name: body.name });
  }

  updateGroup(body: IGroupUpdateBody): Promise<IGroupModel> {
    return this.groupModel.query().patchAndFetchById(body.id, {
      name: body.name,
      updated_at: new Date().toISOString(),
    });
  }

  deleteGroup(body: IGroupIdentity): Promise<IGroupModel> {
    const accounts = []; //@todo get accounts by group. Only empty group with no accounts can be removed
    return this.groupModel.query().patchAndFetchById(body.id, {
      is_deleted: true,
      updated_at: new Date().toISOString(),
    });
  }

  getList(body?: IGroupGetListBody): Promise<IGroupModel[]> {
    const qb = this.groupModel.query().where('is_deleted', false);
    if (body?.name) {
      qb.where('name', 'ilike', `%${body.name}%`);
    }

    qb.page(body.page, body.pageLimit);
    return qb;
  }

  getById(body: IGroupIdentity): Promise<IGroupModel> {
    return this.groupModel.query().findById(body.id);
  }
}
