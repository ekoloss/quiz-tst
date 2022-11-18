import {
  Controller,
  Put,
  Post,
  Body,
  Param,
  Get,
  Delete,
  UseGuards,
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
import { Auth, AuthData, AuthGuard, IRequestAuth } from '@app/auth';

import { AccountService } from './account.service';
import { accountValidation } from './validate';

@Controller(apiPrefix)
@UseGuards(AuthGuard)
export class AccountController {
  constructor(private readonly appService: AccountService) {}

  @Post('account')
  @Auth({ role: ['admin'] })
  create(
    @AuthData() auth: IRequestAuth,
    @Body(accountValidation.create.body) body: IAccountCreateBody,
  ): Promise<IAccountResponse> {
    return this.appService.create(auth, body);
  }

  @Put('account/change-password')
  @Auth({ mode: 'authorised' })
  changePassword(
    @AuthData() auth: IRequestAuth,
    @Body(accountValidation.changePassword.body)
    body: IAccountChangePasswordBody,
  ): Promise<IAccountResponse> {
    return this.appService.changePassword(auth, body);
  }

  @Put('account/:id')
  @Auth({ role: ['admin'] })
  update(
    @AuthData() auth: IRequestAuth,
    @Param(accountValidation.update.param) param: IAccountUpdateParams,
    @Body(accountValidation.update.body) body: IAccountUpdateBody,
  ): Promise<IAccountResponse> {
    return this.appService.update(auth, param, body);
  }

  @Put('account/:id/reset-password')
  @Auth({ role: ['admin'] })
  resetPassword(
    @AuthData() auth: IRequestAuth,
    @Param(accountValidation.resetPassword.param) param: IAccountUpdateParams,
    @Body(accountValidation.resetPassword.body)
    body: IAccountResetPasswordBody,
  ): Promise<IAccountResponse> {
    return this.appService.resetPassword(auth, param, body);
  }

  @Delete('account/:id')
  @Auth({ role: ['admin'] })
  delete(
    @AuthData() auth: IRequestAuth,
    @Param(accountValidation.delete.param) param: IAccountDeleteParams,
  ): Promise<IAccountResponse> {
    return this.appService.delete(auth, param);
  }

  @Get('account/self')
  @Auth({ mode: 'authorised' })
  getSelfAccount(@AuthData() auth: IRequestAuth): Promise<IAccountResponse> {
    return this.appService.getSelf(auth);
  }

  @Get('account/:id')
  @Auth({ role: ['admin'] })
  getById(
    @AuthData() auth: IRequestAuth,
    @Param(accountValidation.getById.param) param: IAccountGetByIdParams,
  ): Promise<IAccountResponse> {
    return this.appService.getById(auth, param);
  }

  @Post('login')
  @Auth({ mode: 'guest' })
  login(
    @Body(accountValidation.login.body) body: ILoginBody,
  ): Promise<ILoginResponse> {
    return this.appService.login(body);
  }
}
