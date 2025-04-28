const { Brand } = require("../models/models");
const ApiError = require("../error/ApiError");

class BrandController {
  async create(req, res, next) {
    try {
      const { name } = req.body;

      const isExist = await Brand.findOne({ where: { name } });
      if (isExist) {
        return next(ApiError.badRequest("Такой бренд уже существует!"));
      }

      const brand = await Brand.create({ name });
      return res.json(brand);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    const brands = await Brand.findAll();
    return res.json(brands);
  }

  async delete(req, res, next) {
    try {
      const { id } = req.query;
      await Brand.destroy({ where: { id } });
      return res.json("Бренд удален");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new BrandController();
