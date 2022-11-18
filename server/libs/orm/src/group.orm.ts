import { Model, Column, Table, columnTypes, Relation } from 'nestjs-objection';
import { IGroupModel } from '@models';
import { AccountOrm } from '@app/orm/account.orm';

@Table({ tableName: 'group' })
export class GroupOrm extends Model implements IGroupModel {
  @Column({
    type: columnTypes.uuid,
    primary: true,
    unique: true,
    notNullable: true,
  })
  id: string;

  @Column({
    type: columnTypes.string,
    unique: true,
    notNullable: true,
  })
  name: string;

  @Column({
    type: columnTypes.boolean,
    notNullable: true,
  })
  is_deleted: boolean;

  @Column({
    type: columnTypes.datetime,
    notNullable: true,
  })
  updated_at: string;
}
