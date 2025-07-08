import bcrypt from "bcrypt";
import User from "./database/models/User";

const adminSeeder = async (): Promise<void> => {
  const [data] = await User.findAll({
    where: {
      email: "p22admin@gmail.com",
    },
  });
  if (!data) {
    await User.create({
      email: "p22admin@gmail.com",
      password: bcrypt.hashSync("p22admin", 8),
      username: "p2admin2",
      role: "admin",
    });
    console.log("Admin credentials seeded successfully");
  } else {
    console.log("Admin credentials already seeded");
  }
};
 
export default adminSeeder;
 