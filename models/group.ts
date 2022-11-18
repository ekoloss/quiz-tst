
export interface IGroupModel {
  id: string;
  name: string;
}

export interface IGroupCreateBody extends Omit<IGroupModel, 'id' > {}
export interface IGroupGetListBody {
  name?: string;
  page?: number;
  pageLimit?: number;
}
export interface IGroupUpdateBody extends IGroupModel {}
export interface IGroupIdentity extends Omit<IGroupModel, 'name' > {}

