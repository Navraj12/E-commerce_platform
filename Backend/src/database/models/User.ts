import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "users",
  modelName: "User",
  timestamps: true,
})
class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
  })
  declare username: string;

  // Additive, nullable — populated from the register page's "Personal
  // details" section. Optional so existing users/rows remain valid.
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare firstName: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare lastName: string | null;

  @Column({
    type: DataType.ENUM("customer", "admin"),
    defaultValue: "customer",
  })
  declare role: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare email: string;
  @Column({
    type: DataType.STRING,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare resetToken: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare resetTokenExpiry: Date | null;
}

export default User;
