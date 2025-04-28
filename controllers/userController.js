const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Basket, Favorite, Order } = require("../models/models");

const generateJwt = (id, name, email, role) => {
  return jwt.sign({ id, name, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return next(ApiError.badRequest("Некорректные данные пользователя"));
      }

      const emailExist = await User.findOne({ where: { email } });
      if (emailExist) {
        return next(
          ApiError.badRequest("Пользователь с таким email уже существует")
        );
      }

      const hashPassword = await bcrypt.hash(password, 5);
      const user = await User.create({
        name,
        email,
        role,
        password: hashPassword,
      });
      await Basket.create({ userId: user.id });
      await Favorite.create({ userId: user.id });
      await Order.create({ userId: user.id });
      const token = generateJwt(user.id, user.name, user.email, user.role);
      return res.json({ token });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return next(ApiError.internal("Пользователь не найден"));
      }
      let comparePassword = bcrypt.compareSync(password, user.password);

      if (!comparePassword) {
        return next(ApiError.internal("Указан неверный пароль"));
      }

      const token = generateJwt(user.id, user.name, user.email, user.role);
      return res.json({ token });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async check(req, res, next) {
    try {
      const token = generateJwt(
        req.user.id,
        req.user.name,
        req.user.email,
        req.user.role
      );
      return res.json({ token });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new UserController();
