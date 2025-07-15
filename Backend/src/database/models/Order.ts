import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "orders",
  modelName: "Order",
  timestamps: true,
})
class Order extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4, // Generates a new UUID for each product
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare shippingAddress: string;
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare totalAmount: number;

  @Column({
    type: DataType.ENUM("pending", "shipped", "delivered", "cancelled"),
    allowNull: false,
  })
  declare orderStatus: string;
}

export default Order;
