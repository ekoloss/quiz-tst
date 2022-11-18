import { ConfigService } from '@nestjs/config';
import { DynamicModule } from '@nestjs/common';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';

import { configModule } from './configModule';

export const redisModule = (): DynamicModule =>
  RedisModule.forRootAsync({
    imports: [configModule()],
    inject: [ConfigService],
    useFactory: async (
      configService: ConfigService,
    ): Promise<RedisModuleOptions> => ({
      config: configService.get('redis'),
    }),
  });
