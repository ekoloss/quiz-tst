import { Model, Column, Table, columnTypes } from 'nestjs-objection';
import { ITemplateModel } from '@models';

@Table({ tableName: 'template' })
export class TemplateOrm extends Model implements ITemplateModel {
  @Column({
    type: columnTypes.uuid,
    primary: true,
  })
  id: string;

  @Column({
    type: columnTypes.string,
    notNullable: true,
  })
  name: string;

  @Column({
    type: columnTypes.number,
    notNullable: true,
    default: 0,
  })
  interview_count: number;

  @Column({
    type: columnTypes.datetime,
  })
  last_interview: string;

  @Column({
    type: columnTypes.boolean,
    default: false,
    notNullable: true,
  })
  is_deleted: boolean;

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
