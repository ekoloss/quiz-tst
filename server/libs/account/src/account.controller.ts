import { Controller, Get, Post, Body } from '@nestjs/common';
import { IAccountCreateBody, IAccountResponse } from '@models';
import { AccountService } from './account.service';
import { accountCreateBodyValidation } from './validate';

@Controller()
export class AccountController {
  constructor(private readonly appService: AccountService) {}

  @Get()
  getHello(): Promise<any> {
    return this.appService.getHello();
  }

  @Post()
  createAccount(
    @Body(accountCreateBodyValidation) body: IAccountCreateBody,
  ): Promise<IAccountResponse> {
    return this.appService.createAccount(body);
  }
}
