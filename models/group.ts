import {IPaginate} from "./core";

export interface IGroupModel {
  id: string;
  name: string;
}

export interface IGroupCreateBody extends Omit<IGroupModel, 'id' > {}
export interface IGroupGetListQuery extends IPaginate {
  name?: string;
}
export interface IGroupUpdateBody extends Omit<IGroupModel, 'id' > {}
export interface IGroupIdentity extends Omit<IGroupModel, 'name' > {}

export interface IGroupIdentityList {
  groups: IGroupIdentity[]
}

