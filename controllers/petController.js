const { Pet } = require("../models/models");
const ApiError = require("../error/ApiError");

class PetController {
  async create(req, res, next) {
    try {
      const { name } = req.body;

      const isExist = await Pet.findOne({ where: { name } });
      if (isExist) {
        return next(
          ApiError.badRequest("Такой раздел питомцев уже существует!")
        );
      }

      const pet = await Pet.create({ name });
      return res.json(pet);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    const pets = await Pet.findAll();
    return res.json(pets);
  }

  async delete(req, res, next) {
    try {
      const { id } = req.query;

      await Pet.destroy({ where: { id } });
      return res.json("Раздел питомцев удален");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new PetController();
