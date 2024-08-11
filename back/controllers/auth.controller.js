const AuthService = require("../services/auth.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const { JWT_SECRET } = process.env;

const authService = new AuthService();

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.userId,
      name: user.name,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return { accessToken };
};

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: "Usuario registrado correctamente", user });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email o contraseña inválidos" });
    }
    const tokens = generateTokens(user);
    res.status(201).json(tokens);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  register,
  login,
};
