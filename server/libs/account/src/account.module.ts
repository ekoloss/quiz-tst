import { Module } from '@nestjs/common';
import { ObjectionModule } from 'nestjs-objection';

import { configModule, redisModule } from '@app/utils';
import { AccountOrm } from '@app/orm';

import { AccountService } from './account.service';
import { AccountController } from './account.controller';

@Module({
  imports: [
    configModule(),
    redisModule(),
    ObjectionModule.forFeature([AccountOrm]),
  ],
  providers: [AccountService],
  exports: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
