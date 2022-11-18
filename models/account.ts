import { IPaginate, ISort } from './core';

export interface IAccountRole {
  superAdmin: boolean;
  admin: boolean;
  user: boolean;
}

export interface IAccountModel {
  id: string;
  login: string;
  password: string;
  role: IAccountRole;
  is_deleted: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface IAccountCreateBody extends Omit<IAccountModel, 'id' | 'is_deleted' | 'last_login' | 'created_at' | 'updated_at'> {
  passwordConfirm: string;
}
export interface IAccountUpdateParams extends Pick<IAccountModel, 'id'> {}
export interface IAccountUpdateBody extends Pick<IAccountModel, 'login'> {}
export interface IAccountResetPasswordBody extends Pick<IAccountModel, 'password'> {
  passwordConfirm: string;
}
export interface IAccountGetByIdParams extends Pick<IAccountModel, 'id'> {}
export interface IAccountDeleteParams extends Pick<IAccountModel, 'id'> {}

export type sortFields = 'login' | 'created_at' | 'last_login';
export interface IAccountGetListQuery extends IPaginate, ISort<sortFields> {
  login?: string;
  start_date?: string;
  end_date?: string;
}

export interface IAccountChangePasswordBody extends Pick<IAccountModel, 'password'> {
  passwordConfirm: string;
  oldPassword: string;
}

export interface IAccountResponse extends Omit<IAccountModel, 'password' | 'is_deleted'> {}

export interface ILoginBody extends Pick<IAccountModel, 'login' | 'password'> {}
export interface ILoginResponse {
  token: string;
}
