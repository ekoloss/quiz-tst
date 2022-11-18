import { Model, Column, Table, columnTypes, Relation } from 'nestjs-objection';
import { IAccountModel, IAccountRole } from '@models';
import { GroupOrm } from '@app/orm/group.orm';

@Table({ tableName: 'account' })
export class AccountOrm extends Model implements IAccountModel {
  @Column({
    type: columnTypes.uuid,
    primary: true,
  })
  id: string;

  @Column({
    type: columnTypes.string,
    unique: true,
    notNullable: true,
  })
  login: string;

  @Column({
    type: columnTypes.string,
    notNullable: true,
  })
  password: string;

  @Column({
    type: columnTypes.json,
    notNullable: true,
  })
  role: IAccountRole;

  @Column({
    type: columnTypes.boolean,
    default: 'false',
    notNullable: true,
  })
  is_deleted: boolean;

  @Column({ type: columnTypes.datetime })
  last_login: string;

  @Column({
    type: columnTypes.datetime,
    notNullable: true,
  })
  created_at: string;

  @Column({
    type: columnTypes.datetime,
    notNullable: true,
  })
  updated_at: string;
}
