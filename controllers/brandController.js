const { Brand} = require("../models/models");
const ApiError = require("../error/ApiError");

class BrandController {
  async create(req, res, next) {
    try {
      const { name } = req.body;

      const isExist = await Brand.findOne({ where: { name } });
      if (isExist) {
        return next(
          ApiError.badRequest("Такой бренд уже существует!")
        );
      }

      const type = await Brand.create({ name });
      return res.json(type);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    const types = await Brand.findAll({
      order: [
        ['id', 'ASC']
      ]
    });
    return res.json(types);
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const type = await Brand.findOne({
        where: { id },
      });

      if (!type) {
        return next(ApiError.badRequest("Не найден"));
      } else {
        await Brand.update({ name }, { where: { id } });
        return res.json("Обновлено");
      }
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await Brand.destroy({ where: { id } });
      return res.json("Тип удален");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new BrandController();
