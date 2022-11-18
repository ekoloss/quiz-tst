import { Model, Column, Table, columnTypes } from 'nestjs-objection';
import { IAccountGroups } from '@models';

@Table({ tableName: 'account_groups' })
export class AccountGroupsOrm extends Model implements IAccountGroups {
  @Column({
    type: columnTypes.uuid,
    notNullable: true,
  })
  account_id: string;

  @Column({
    type: columnTypes.string,
    notNullable: true,
  })
  group_id: string;
}
