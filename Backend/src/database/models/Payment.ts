import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "payments",
  modelName: "Payment",
  timestamps: true,
})
class Payment extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4, // Generates a new UUID for each product
  })
  declare id: string;
  @Column({
    type: DataType.ENUM("cod", "khalti", "esewa"),
    allowNull: false,
  })
  declare paymentMethod: string;

  @Column({
    type: DataType.ENUM("pending", "paid", "unpaid"),
    allowNull: false,
    defaultValue: "pending",
  })
  declare paymentStatus: string;

  @Column({
    type: DataType.STRING,
  })
  declare pidx: string;
}

export default Payment;
