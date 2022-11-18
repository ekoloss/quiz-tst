import { Module } from '@nestjs/common';
import {
  Model,
  ObjectionModule,
  ObjectionModuleOptions,
} from 'nestjs-objection';
import { ConfigService } from '@nestjs/config';

import { configModule } from '@app/utils';
import { AccountOrm } from '@app/orm';
import { AccountModule } from '@app/account';

import { AppService } from './app.service';

@Module({
  providers: [AppService],
  imports: [
    AccountModule,
    ObjectionModule.forRootAsync({
      imports: [configModule()],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<ObjectionModuleOptions> => ({
        Model,
        config: {
          client: 'pg',
          version: configService.get('pg.version'),
          connection: configService.get('pg'),
        },
      }),
    }),
    ObjectionModule.forFeature([AccountOrm]),
    configModule(),
  ],
})
export class AppModule {}
