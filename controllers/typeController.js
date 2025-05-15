const { Type, Product, ProductPhoto, Brand, Tag} = require("../models/models");
const ApiError = require("../error/ApiError");

class TypeController {
  async create(req, res, next) {
    try {
      const { name } = req.body;

      const isExist = await Type.findOne({ where: { name } });
      if (isExist) {
        return next(
          ApiError.badRequest("Такой тип уже существует!")
        );
      }

      const type = await Type.create({ name });
      return res.json(type);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    const types = await Type.findAndCountAll({
      order: [['id', 'ASC']],
      include: [
        {
          model: Brand,
          through: { model: Product, as: 'product' },
          as: 'brands',
        },
      ],
    });
    return res.json(types);
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const type = await Type.findOne({
        where: { id },
      });

      if (!type) {
        return next(ApiError.badRequest("Не найден"));
      } else {
        await Type.update({ name }, { where: { id } });
        return res.json("Обновлено");
      }
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await Type.destroy({ where: { id } });
      return res.json("Тип удален");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new TypeController();
