import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Category from "./Category";
import User from "./User";

@Table({
  tableName: "products",
  modelName: "Product",
  timestamps: true,
})
class Product extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4, // Generates a new UUID for each product
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
  })
  declare productName: string;

  @Column({
    type: DataType.TEXT,
  })
  declare productDescription: string;
  @Column({
    type: DataType.FLOAT,
  })
  declare productPrice: number;

  @Column({
    type: DataType.INTEGER,
  })
  declare productTotalStockQty: number;

  @Column({
    type: DataType.STRING,
  })
  declare productImageUrl: string;
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  declare userId: string;

  @ForeignKey(() => Category)
  @Column({ type: DataType.UUID })
  declare categoryId: string;
}

export default Product;
