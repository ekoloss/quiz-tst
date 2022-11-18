import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const appService = app.get(AppService);

  await appService.init();
  await app.listen(configService.get('SERVER_PORT'));
}
bootstrap();
