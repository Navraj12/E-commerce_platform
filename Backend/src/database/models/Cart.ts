import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import Product from "./Product";
import User from "./User";

@Table({
  tableName: "carts",
  modelName: "Cart",
  timestamps: true,
})
class Cart extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare quantity: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  declare userId: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID })
  declare productId: string;
}

export default Cart;
