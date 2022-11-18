import { IAccountRole } from '@models';

export interface IRequestAuth {
  id: string;
  role: IAccountRole;
}

export interface NestRequest extends Request {
  auth: IRequestAuth;
  isAuthorized: boolean;
}

export interface IAuthAccessOptions {
  role?: ('superAdmin' | 'admin' | 'user')[];
  mode?: 'guest' | 'authorised' | 'any';
}
