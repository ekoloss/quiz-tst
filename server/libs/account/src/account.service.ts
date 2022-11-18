import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { InjectModel } from 'nestjs-objection';
import { IAccountCreateBody, IAccountResponse } from '@models';
import { AccountOrm } from '@app/orm';

@Injectable()
export class AccountService {
  private readonly redis: Redis;

  constructor(
    private configService: ConfigService,
    private readonly redisService: RedisService,
    @InjectModel(AccountOrm) private readonly accountModel: typeof AccountOrm,
  ) {
    this.redis = this.redisService.getClient();
  }

  async createAccount(body: IAccountCreateBody): Promise<IAccountResponse> {
    return this.accountModel.query().first();
  }

  async getHello(): Promise<any> {
    return 'hello';
  }
}
