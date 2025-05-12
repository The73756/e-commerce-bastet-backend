const {
  BasketProduct,
  Product,
  ProductPhoto,
  Type,
  Brand, Tag,
} = require("../models/models");
const ApiError = require("../error/ApiError");

class BasketController {
  async create(req, res, next) {
    try {
      let { productId, basketId } = req.body;

      const basketProduct = await BasketProduct.create(
        {
          productId,
          basketId,
          count: 1,
        },
      );

      const result = await BasketProduct.findOne({
        where: { id: basketProduct.id },
        include: [
          {
            model: Product,
            as: 'product',
            include: [
              { model: ProductPhoto, as: 'photos' },
              { model: Type, as: 'type' },
              { model: Brand, as: 'brand' },
              { model: Tag, as: 'tag' }
            ]
          }
        ]
      });

      return res.json(result);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const {id} = req.params;
      const { count } = req.body;
      const product = await BasketProduct.findOne({
        where: { id },
      });

      if (!product) {
        return next(ApiError.badRequest("Товар не найден"));
      } else {
        await BasketProduct.update({ count }, { where: { id } });
        return res.json("Количество товара в корзине обновлено");
      }
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const { basketId } = req.params;

      const basketProducts = await BasketProduct.findAll({
        where: { basketId },
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
      return res.json(basketProducts);
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

      await BasketProduct.destroy({
        where: { id },
      });

      return res.json("Товар удален из корзины");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new BasketController();
