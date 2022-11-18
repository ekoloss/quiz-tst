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
}

export interface IAccountCreateBody extends Omit<IAccountModel, 'id'> {
  passwordConfirm: string;
}
export interface IAccountUpdateParams extends Pick<IAccountModel, 'id'> {}
export interface IAccountUpdateBody extends Omit<IAccountModel, 'password' | 'id'> {}
export interface IAccountChangePasswordBody extends Pick<IAccountModel, 'password'> {
  passwordConfirm: string;
  newPassword: string;
}
export interface IAccountResponse extends Omit<IAccountModel, 'password'> {}

