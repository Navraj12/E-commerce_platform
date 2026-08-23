import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "coupons",
  modelName: "Coupon",
  timestamps: true,
})
class Coupon extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  })
  declare discountPercent: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare expiryDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare active: boolean;
}

export default Coupon;
