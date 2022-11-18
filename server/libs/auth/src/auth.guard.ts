import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

import { NestRequest, IAuthAccessOptions } from './interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.decryptToken(context);
    return this.checkAccess(context);
  }

  checkAccess(context: ExecutionContext) {
    const { isAuthorized, auth } = context
      .switchToHttp()
      .getRequest<NestRequest>();
    const options: IAuthAccessOptions = {
      ...this.reflector.get<IAuthAccessOptions>(
        'authAccess',
        context.getClass(),
      ),
      ...this.reflector.get<IAuthAccessOptions>(
        'authAccess',
        context.getHandler(),
      ),
    };

    if (options.mode === 'any') {
      return true;
    }

    if (
      (isAuthorized && options.mode === 'guest') ||
      (!isAuthorized && options.mode === 'authorised')
    ) {
      throw new UnauthorizedException();
    }

    if (options.mode === 'guest') {
      return true;
    }

    if (options.role?.every((roleName) => !auth?.role[roleName])) {
      throw new UnauthorizedException();
    }

    return true;
  }

  decryptToken(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<NestRequest>();

    request.auth = null;
    request.isAuthorized = false;

    if (request.headers['authorization']) {
      try {
        request.auth = jwt.verify(
          request.headers['authorization']
            .replace(/Bearer/gi, '')
            .replace(/ /g, '')
            .replace(/['"]+/g, ''),
          this.configService.get('jwt.privateKey'),
          {
            expiresIn: this.configService.get('jwt.expiresIn'),
            algorithm: this.configService.get('jwt.algorithm'),
          },
        );

        request.isAuthorized = true;
      } catch (err) {
        console.error(err);
      }
    }
  }
}
