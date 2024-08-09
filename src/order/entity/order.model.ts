import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'orders' })
export class Order extends Model<Order> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  tokenA: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  tokenB: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  user: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amountA: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amountB: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  active: boolean;
}
