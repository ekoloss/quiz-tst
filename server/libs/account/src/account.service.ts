import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { InjectModel } from 'nestjs-objection';
import { ref } from 'objection';
import { v5 as hash, v4 as uuid } from 'uuid';
import * as jwt from 'jsonwebtoken';
import { startOfDay, endOfDay } from 'date-fns';

import {
  IAccountChangePasswordBody,
  IAccountCreateBody,
  IAccountDeleteParams,
  IAccountGetByIdParams,
  IAccountGetListQuery,
  IAccountModel,
  IAccountResetPasswordBody,
  IAccountResponse,
  IAccountUpdateBody,
  IAccountUpdateParams,
  ILoginBody,
  ILoginResponse,
  IPaginateResult,
} from '@models';
import { namespaces } from '@app/utils';
import { AccountOrm } from '@app/orm';
import { IRequestAuth } from '@app/auth';

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

  async create(
    auth: IRequestAuth,
    { login, password, role }: IAccountCreateBody,
  ): Promise<IAccountResponse> {
    if (!auth.role.superAdmin && (role.admin || role.superAdmin)) {
      throw new ForbiddenException();
    }

    if (role.user && (role.admin || role.superAdmin)) {
      throw new BadRequestException();
    }

    if (role.superAdmin) {
      role.admin = true;
    }

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
    auth: IRequestAuth,
    { id }: IAccountUpdateParams,
    { login }: IAccountUpdateBody,
  ): Promise<IAccountResponse> {
    await this.checkForRights(id, auth);

    const account = await this.accountModel
      .query()
      .where('is_deleted', false)
      .updateAndFetchById(id, {
        login,
        updated_at: new Date().toISOString(),
      });

    return this.cleanPublicAccount(account);
  }

  async delete(
    auth: IRequestAuth,
    { id }: IAccountDeleteParams,
  ): Promise<IAccountResponse> {
    await this.checkForRights(id, auth);

    const account = await this.accountModel
      .query()
      .where('is_deleted', false)
      .updateAndFetchById(id, {
        is_deleted: true,
        updated_at: new Date().toISOString(),
      });

    return this.cleanPublicAccount(account);
  }

  async resetPassword(
    auth: IRequestAuth,
    { id }: IAccountUpdateParams,
    { password }: Pick<IAccountResetPasswordBody, 'password'>,
  ): Promise<IAccountResponse> {
    await this.checkForRights(id, auth);
    return this.hardResetPassword({ id }, { password });
  }

  async changePassword(
    { id }: IRequestAuth,
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

    return this.hardResetPassword({ id }, { password });
  }

  async getSelf({ id }: IRequestAuth): Promise<IAccountResponse> {
    const account = await this.accountModel
      .query()
      .findById(id)
      .where('is_deleted', false);

    if (!account) {
      throw new NotFoundException();
    }

    return this.cleanPublicAccount(account);
  }

  async getById(
    auth: IRequestAuth,
    { id }: IAccountGetByIdParams,
  ): Promise<IAccountResponse> {
    const account = await this.checkForRights(id, auth);
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
        } as IRequestAuth,
        this.configService.get('jwt.privateKey'),
        {
          expiresIn: this.configService.get('jwt.expiresIn'),
          algorithm: this.configService.get('jwt.algorithm'),
        },
      ),
    };
  }

  async getList(
    {
      page,
      page_size,
      sort_by,
      sort_order,
      login,
      start_date,
      end_date,
    }: IAccountGetListQuery,
    {
      userList = true,
    }: {
      userList?: boolean;
    } = {},
  ): Promise<IPaginateResult<IAccountResponse>> {
    const query = this.accountModel
      .query()
      .where('is_deleted', false)
      .where(ref('role:user').castBool(), userList)
      .page(page, page_size);

    if (sort_by && sort_order) {
      query.orderBy(sort_by, sort_order);
    }

    if (login) {
      query.where('login', 'ilike', `%${login}%`);
    }

    if (start_date) {
      query.where(
        'created_at',
        '>',
        startOfDay(new Date(start_date)).toISOString(),
      );
    }

    if (end_date) {
      query.where(
        'created_at',
        '<',
        endOfDay(new Date(end_date)).toISOString(),
      );
    }

    const res = await query;

    return {
      total: res.total,
      results: res.results.map((account) => this.cleanPublicAccount(account)),
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

  private async hardResetPassword(
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

    await this.redis.set(`salt_${id}`, salt);

    return this.cleanPublicAccount(account);
  }

  private async checkForRights(id: string, auth: IRequestAuth) {
    const account = await this.accountModel
      .query()
      .where('is_deleted', false)
      .findById(id);

    if (!account) {
      throw new NotFoundException();
    }

    if (!account.role.user && !auth.role.superAdmin) {
      throw new ForbiddenException();
    }

    return account;
  }
}
