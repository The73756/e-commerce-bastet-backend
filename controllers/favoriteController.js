const {
  FavoriteProduct,
  Product,
  ProductPhoto,
  Type,
  Brand, Tag,
} = require("../models/models");
const ApiError = require("../error/ApiError");

class FavoriteController {
  async create(req, res, next) {
    try {
      let { productId, favoriteId } = req.body;

      const favoriteProduct = await FavoriteProduct.create({
        productId,
        favoriteId,
      });

      return res.json(favoriteProduct);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const { favoriteId } = req.params;

      const favoriteProducts = await FavoriteProduct.findAll({
        where: { favoriteId },
        include: [
          {
            model: Product,
            include: [
              { model: ProductPhoto, as: "photos" },
              { model: Type, as: "type" },
              { model: Brand, as: "brand" },
              { model: Tag, as: "tag" },
            ],
          },
        ],
      });
      return res.json(favoriteProducts);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        return next(ApiError.badRequest("Товар с таким id не найден"));
      }

      await FavoriteProduct.destroy({
        where: { id },
      });

      return res.json("Товар удален из избранного");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new FavoriteController();
