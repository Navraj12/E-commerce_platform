import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "categories",
  modelName: "Category",
  timestamps: true,
})
class Category extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4, // Generates a new UUID for each product
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
  })
  declare categoryName: string;
}

export default Category;
