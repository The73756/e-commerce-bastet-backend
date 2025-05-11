const { Tag} = require("../models/models");
const ApiError = require("../error/ApiError");

class TagController {
  async create(req, res, next) {
    try {
      const { name } = req.body;

      const isExist = await Tag.findOne({ where: { name } });
      if (isExist) {
        return next(
          ApiError.badRequest("Такой тег уже существует!")
        );
      }

      const type = await Tag.create({ name });
      return res.json(type);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    const types = await Tag.findAll({
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
      const type = await Tag.findOne({
        where: { id },
      });

      if (!type) {
        return next(ApiError.badRequest("Не найден"));
      } else {
        await Tag.update({ name }, { where: { id } });
        return res.json("Обновлено");
      }
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await Tag.destroy({ where: { id } });
      return res.json("Удален");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new TagController();
