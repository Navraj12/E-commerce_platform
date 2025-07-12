import { Sequelize } from "sequelize-typescript";

import dotenv from "dotenv";
import path from "path";
import Cart from "./models/Cart";
import Category from "./models/Category";
import Product from "./models/Product";
import User from "./models/User";
dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: "mysql",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  models: [path.join(__dirname, "models/")],
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

sequelize.sync({ force: false }).then(() => {
  console.log("synced !!!");
});

//Relationships
//User product relation
User.hasMany(Product, { foreignKey: "userId" });
Product.belongsTo(User, { foreignKey: "userId" });

//Product category relation
Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasOne(Product, { foreignKey: "categoryId" });

//User cart relation
User.hasMany(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

//cart product relation
Product.hasMany(Cart, { foreignKey: "productId" });
Cart.belongsTo(Product, { foreignKey: "productId" });
export default sequelize;
