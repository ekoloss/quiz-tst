import {
  Controller,
  Put,
  Post,
  Body,
  Param,
  Get,
  Delete,
} from '@nestjs/common';

import {
  IAccountChangePasswordBody,
  IAccountCreateBody,
  IAccountDeleteParams,
  IAccountGetByIdParams,
  IAccountResetPasswordBody,
  IAccountResponse,
  IAccountUpdateBody,
  IAccountUpdateParams,
  ILoginBody,
  ILoginResponse,
} from '@models';
import { apiPrefix } from '@app/utils';

import { AccountService } from './account.service';
import { accountValidation } from './validate';

@Controller()
export class AccountController {
  constructor(private readonly appService: AccountService) {}

  @Post(`${apiPrefix}/account`)
  create(
    @Body(accountValidation.create.body) body: IAccountCreateBody,
  ): Promise<IAccountResponse> {
    return this.appService.create(body);
  }

  @Put(`${apiPrefix}/account/change-password`)
  changePassword(
    auth: any,
    @Body(accountValidation.changePassword.body)
    body: IAccountChangePasswordBody,
  ): Promise<IAccountResponse> {
    return this.appService.changePassword(auth, body);
  }

  @Put(`${apiPrefix}/account/:id`)
  update(
    @Param(accountValidation.update.param) param: IAccountUpdateParams,
    @Body(accountValidation.update.body) body: IAccountUpdateBody,
  ): Promise<IAccountResponse> {
    return this.appService.update(param, body);
  }

  @Put(`${apiPrefix}/account/:id/reset-password`)
  resetPassword(
    @Param(accountValidation.resetPassword.param) param: IAccountUpdateParams,
    @Body(accountValidation.resetPassword.body)
    body: IAccountResetPasswordBody,
  ): Promise<IAccountResponse> {
    return this.appService.resetPassword(param, body);
  }

  @Delete(`${apiPrefix}/account/:id`)
  delete(
    @Param(accountValidation.delete.param) param: IAccountDeleteParams,
  ): Promise<IAccountResponse> {
    return this.appService.delete(param);
  }

  @Get(`${apiPrefix}/account/:id`)
  getById(
    @Param(accountValidation.getById.param) param: IAccountGetByIdParams,
  ): Promise<IAccountResponse> {
    return this.appService.getById(param);
  }

  @Post(`${apiPrefix}/login`)
  login(
    @Body(accountValidation.login.body) body: ILoginBody,
  ): Promise<ILoginResponse> {
    return this.appService.login(body);
  }
}
