import { Injectable } from '@nestjs/common';
import { InjectModel, synchronize } from 'nestjs-objection';

import { AccountOrm } from '@app/orm';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(AccountOrm) private readonly accountModel: typeof AccountOrm,
  ) {}

  async init(): Promise<void> {
    await synchronize(AccountOrm);
  }
}
