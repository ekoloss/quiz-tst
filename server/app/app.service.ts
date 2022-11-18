import { Injectable } from '@nestjs/common';
import { InjectModel, synchronize } from 'nestjs-objection';

import { AccountOrm, GroupOrm } from '@app/orm';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(AccountOrm) private readonly accountModel: typeof AccountOrm,
    @InjectModel(GroupOrm) private readonly groupModel: typeof GroupOrm,
  ) {}

  async init(): Promise<void> {
    await synchronize(AccountOrm);
    await synchronize(GroupOrm);
  }
}
