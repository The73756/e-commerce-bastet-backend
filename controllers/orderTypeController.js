const { OrderType} = require("../models/models");
const ApiError = require("../error/ApiError");

class OrderTypeController {
  async create(req, res, next) {
    try {
      const { name, price } = req.body;

      const isExist = await OrderType.findOne({ where: { name } });
      if (isExist) {
        return next(
          ApiError.badRequest("Такой тип уже существует!")
        );
      }

      const type = await OrderType.create({ name, price });
      return res.json(type);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    const types = await OrderType.findAll({
      order: [
        ['id', 'ASC']
      ]
    });
    return res.json(types);
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, price } = req.body;
      const type = await OrderType.findOne({
        where: { id },
      });

      if (!type) {
        return next(ApiError.badRequest("Не найден"));
      } else {
        await OrderType.update({ name, price }, { where: { id } });
        return res.json("Обновлено");
      }
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await OrderType.destroy({ where: { id } });
      return res.json("Тип удален");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new OrderTypeController();
