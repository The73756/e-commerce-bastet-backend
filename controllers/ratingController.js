const {
  Rating,
  Product,
  ProductPhoto,
  Type,
  Brand,
} = require("../models/models");
const ApiError = require("../error/ApiError");
const { Sequelize } = require("sequelize");

const updateRating = async (productId) => {
  const avgRating = await Rating.findAll({
    where: { productId },
    attributes: [[Sequelize.fn("AVG", Sequelize.col("rate")), "avgRating"]],
  });

  const result = avgRating.map((r) => r.get("avgRating"))[0];
  const newRating = result ? Number(Number(result).toFixed(2)) : 0;

  Product.update({ rating: newRating }, { where: { id: productId } });

  return {
    newRating: newRating,
    message: "Рейтинг сохранен",
  };
};

class RatingController {
  async create(req, res, next) {
    try {
      const { productId, userId, rate, comment } = req.body;
      const numberRate = Number(rate);
      const rating = await Rating.findOne({ where: { productId, userId } });

      if (rating) {
        if (Number(rating.rate) === numberRate) {
          return res.json("Вы уже оценили этот товар");
        } else {
          await Rating.update({ rate }, { where: { productId, userId } });
        }
      } else {
        await Rating.create({ productId, userId, rate, comment });
      }
      const result = await updateRating(productId);
      return res.json(result);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAllByUser(req, res, next) {
    try {
      const { userId } = req.params;
      const ratings = await Rating.findAll({
        where: { userId },
        include: [
          {
            model: Product,
            include: [
              { model: ProductPhoto, as: "photos" },
              { model: Type, as: "type" },
              { model: Brand, as: "brand" },
            ],
          },
        ],
      });
      return res.json(ratings);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const { userId, productId } = req.params;
      const rating = await Rating.findOne({
        where: { userId, productId },
      });
      if (rating) {
        return res.json(rating);
      } else {
        return res.json(null);
      }
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const {productId} = await Rating.findOne({where: {id}})
      await Rating.destroy({ where: { id } });
      const result = await updateRating(productId);
      return res.json(result);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new RatingController();
