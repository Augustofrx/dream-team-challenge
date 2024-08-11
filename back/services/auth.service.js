const { models } = require("../libs/sequelize");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

class AuthService {
  constructor() {}

  async findByEmail(email) {
    return await models.User.findOne({ where: { email } });
  }

  async register(userData) {
    const { name, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const validateUser = await models.User.findOne({ where: { email } });

      if (!validateUser) {
        const user = await models.User.create({
          id: uuidv4(),
          name,
          email,
          password: hashedPassword,
        });
        return user;
      } else {
        throw new Error("User already exists");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }
}
module.exports = AuthService;
