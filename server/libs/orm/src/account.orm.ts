import {
  Model,
  Column,
  Table,
  columnTypes,
} from 'nestjs-objection';
import { IAccountModel, IAccountRole } from '@models';

@Table({ softDelete: true, tableName: 'account' })
export class AccountOrm extends Model implements IAccountModel {
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
}
