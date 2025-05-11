const { OrderStatus} = require("../models/models");
const ApiError = require("../error/ApiError");

class OrderStatusController {
  async create(req, res, next) {
    try {
      const { name } = req.body;

      const isExist = await OrderStatus.findOne({ where: { name } });
      if (isExist) {
        return next(
          ApiError.badRequest("Такой тип уже существует!")
        );
      }

      const type = await OrderStatus.create({ name });
      return res.json(type);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    const types = await OrderStatus.findAll({
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
      const type = await OrderStatus.findOne({
        where: { id },
      });

      if (!type) {
        return next(ApiError.badRequest("Не найден"));
      } else {
        await OrderStatus.update({ name }, { where: { id } });
        return res.json("Обновлено");
      }
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await OrderStatus.destroy({ where: { id } });
      return res.json("Тип удален");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new OrderStatusController();
