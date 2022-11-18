import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { InjectModel } from 'nestjs-objection';
import { v5 as hash, v4 as uuid } from 'uuid';
import * as jwt from 'jsonwebtoken';
import {
  IAccountChangePasswordBody,
  IAccountCreateBody,
  IAccountDeleteParams,
  IAccountGetByIdParams,
  IAccountModel,
  IAccountResetPasswordBody,
  IAccountResponse,
  IAccountUpdateBody,
  IAccountUpdateParams,
  ILoginBody,
  ILoginResponse,
} from '@models';
import { namespaces } from '@app/utils';
import { AccountOrm } from '@app/orm';

@Injectable()
export class AccountService {
  private readonly redis: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    @InjectModel(AccountOrm) private readonly accountModel: typeof AccountOrm,
  ) {
    this.redis = this.redisService.getClient();
  }

  async create({
    login,
    password,
    role,
  }: IAccountCreateBody): Promise<IAccountResponse> {
    const salt = uuid();

    const account = await this.accountModel.query().insertAndFetch({
      login,
      password: hash(`${password}${salt}`, namespaces.password),
      role,
    });

    await this.redis.set(`salt_${account.id}`, salt);

    return this.cleanPublicAccount(account);
  }

  async update(
    { id }: IAccountUpdateParams,
    { login }: IAccountUpdateBody,
  ): Promise<IAccountResponse> {
    const account = await this.accountModel
      .query()
      .where('is_deleted', false)
      .updateAndFetchById(id, {
        login,
        updated_at: new Date().toISOString(),
      });

    if (!account) {
      throw new NotFoundException();
    }

    return this.cleanPublicAccount(account);
  }

  async delete({ id }: IAccountDeleteParams): Promise<IAccountResponse> {
    const account = await this.accountModel
      .query()
      .where('is_deleted', false)
      .updateAndFetchById(id, {
        is_deleted: true,
        updated_at: new Date().toISOString(),
      });

    if (!account) {
      throw new NotFoundException();
    }

    return this.cleanPublicAccount(account);
  }

  async resetPassword(
    { id }: IAccountUpdateParams,
    { password }: Pick<IAccountResetPasswordBody, 'password'>,
  ): Promise<IAccountResponse> {
    const salt = uuid();
    const account = await this.accountModel
      .query()
      .where('is_deleted', false)
      .updateAndFetchById(id, {
        password: hash(`${password}${salt}`, namespaces.password),
        updated_at: new Date().toISOString(),
      });

    if (!account) {
      throw new NotFoundException();
    }

    await this.redis.set(`salt_${id}`, salt);

    return this.cleanPublicAccount(account);
  }

  async changePassword(
    { id }: any = { id: '04d43793-e0ba-53de-89ac-842d968e84bd' },
    { password, oldPassword }: IAccountChangePasswordBody,
  ): Promise<IAccountResponse> {
    const account = await this.accountModel
      .query()
      .findById(id)
      .where('is_deleted', false);

    if (!account) {
      throw new NotFoundException();
    }

    const oldSalt = await this.redis.get(`salt_${account.id}`);
    if (!oldSalt) {
      throw new BadRequestException();
    }

    if (
      hash(`${oldPassword}${oldSalt}`, namespaces.password) !== account.password
    ) {
      throw new BadRequestException();
    }

    return this.resetPassword({ id }, { password });
  }

  async getById({ id }: IAccountGetByIdParams): Promise<IAccountResponse> {
    const account = await this.accountModel
      .query()
      .findById(id)
      .where('is_deleted', false);

    if (!account) {
      throw new NotFoundException();
    }

    return this.cleanPublicAccount(account);
  }

  async login({ login, password }: ILoginBody): Promise<ILoginResponse> {
    const account = await this.accountModel
      .query()
      .where('login', login)
      .where('is_deleted', false)
      .first();

    if (!account) {
      throw new NotFoundException();
    }

    const salt = await this.redis.get(`salt_${account.id}`);
    if (!salt) {
      throw new BadRequestException();
    }

    if (hash(`${password}${salt}`, namespaces.password) !== account.password) {
      throw new BadRequestException();
    }

    await this.accountModel.query().findById(account.id).update({
      last_login: new Date().toISOString(),
    });

    return {
      token: jwt.sign(
        {
          id: account.id,
          role: account.role,
        },
        this.configService.get('jwt.privateKey'),
        {
          expiresIn: this.configService.get('jwt.expiresIn'),
          algorithm: this.configService.get('jwt.algorithm'),
        },
      ),
    };
  }

  private cleanPublicAccount({
    id,
    login,
    role,
    last_login,
    created_at,
    updated_at,
  }: IAccountModel): IAccountResponse {
    return {
      id,
      login,
      role,
      last_login,
      created_at,
      updated_at,
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
// console.log(require('crypto').randomBytes(256).toString('latin1'));
