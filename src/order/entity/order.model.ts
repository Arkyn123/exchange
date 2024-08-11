import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface IOrder {
  id: string;
  tokenA: string;
  tokenB: string;
  user: string;
  amountA: string;
  amountB: string;
  active: boolean;
}

@Table({ tableName: 'orders' })
export class Order extends Model<Order, IOrder> implements IOrder {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  })
  id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  tokenA: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  tokenB: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  user: string;

  @Column({
    type: DataType.DECIMAL(78, 0),
    allowNull: false,
  })
  amountA: string;

  @Column({
    type: DataType.DECIMAL(78, 0),
    allowNull: false,
  })
  amountB: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  active: boolean;
}
