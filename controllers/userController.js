const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {User, Basket, Favorite} = require("../models/models");

const generateJwt = (id, surname, name, email, phone, role) => {
  return jwt.sign({id, surname, name, email, phone, role}, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res, next) {
    try {
      const {surname, name, email, phone, password, role} = req.body;

      if (!surname || !name || !email || !phone || !password) {
        return next(ApiError.badRequest("Некорректные данные пользователя"));
      }

      const emailExist = await User.findOne({where: {email}});
      if (emailExist) {
        return next(
          ApiError.badRequest("Пользователь с таким email уже существует")
        );
      }

      const phoneExist = await User.findOne({where: {phone}});
      if (phoneExist) {
        return next(
          ApiError.badRequest("Пользователь с таким номером телефона уже существует")
        );
      }

      const hashPassword = await bcrypt.hash(password, 5);
      const user = await User.create({
        surname, name, email, phone, role,
        password: hashPassword,
      });
      await Basket.create({userId: user.id});
      await Favorite.create({userId: user.id});
      const token = generateJwt(user.id, user.surname, user.name, user.email, user.phone, user.role);
      return res.json({token, user});
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

      const token = generateJwt(user.id, user.surname, user.name, user.email, user.phone, user.role);
      return res.json({token, user});
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async check(req, res, next) {
    try {
      const token = generateJwt(
        req.user.id,
        req.user.surname,
        req.user.name,
        req.user.email,
        req.user.phone,
        req.user.role
      );
      return res.json({token, user});
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { surname, name, email, phone, password } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return next(ApiError.badRequest("Пользователь не найден"));
      }

      if (email && email !== user.email) {
        const emailExist = await User.findOne({ where: { email } });
        if (emailExist) {
          return next(
            ApiError.badRequest("Пользователь с таким email уже существует")
          );
        }
      }

      if (phone && phone !== user.phone) {
        const phoneExist = await User.findOne({ where: { phone } });
        if (phoneExist) {
          return next(
            ApiError.badRequest("Пользователь с таким телефоном уже существует")
          );
        }
      }

      const updateData = {
        surname,
        name,
        email,
        phone,
      };

      if (password) {
        updateData.password = await bcrypt.hash(password, 5);
      }

      await user.update(updateData);

      const token = generateJwt(
        user.id,
        user.surname,
        user.name,
        user.email,
        user.phone,
        user.role
      );

      return res.json({
        token,
        user: {
          id: user.id,
          surname: user.surname,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });

    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await User.destroy({ where: { id } });
      return res.json("Account удален");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new UserController();
