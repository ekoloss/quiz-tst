import { Module } from '@nestjs/common';
import {
  Model,
  ObjectionModule,
  ObjectionModuleOptions,
} from 'nestjs-objection';
import { ConfigService } from '@nestjs/config';

import { AccountModule } from '@app/account';
import { configModule } from '@app/utils';

@Module({
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
    configModule(),
  ],
})
export class AppModule {}
