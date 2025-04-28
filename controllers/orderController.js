const {
  OrderItem,
  OrderProduct,
  Product,
  ProductPhoto,
  Pet,
  Brand,
} = require("../models/models");
const ApiError = require("../error/ApiError");

class OrderController {
  async create(req, res, next) {
    try {
      let {
        products,
        orderId,
        status,
        price,
        recipient,
        recipientEmail,
        address,
      } = req.body;

      const order = await OrderItem.create({
        orderId,
        status,
        price,
        recipient,
        recipientEmail,
        address,
      });

      if (products) {
        products = JSON.parse(products);
        products.forEach((i) => {
          OrderProduct.create({
            orderItemId: order.id,
            productId: i.productId, // айди товара id (если передается Product) или productId (если передается BasketProduct) ???
            count: i.count,
          });
        });
      }

      return res.json(order);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id, status } = req.body;
      const order = await OrderItem.findOne({
        where: { id },
      });

      if (!order) {
        return next(ApiError.badRequest("Заказ не найден"));
      } else {
        await OrderItem.update({ status }, { where: { id } });
        return res.json("Статус заказа обновлен");
      }
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAllOfUser(req, res, next) {
    try {
      const { orderId } = req.query;

      const orders = await OrderItem.findAll({
        where: { orderId },
        include: [
          {
            model: OrderProduct,
            as: "products",
            include: [
              {
                model: Product,
                include: [
                  { model: ProductPhoto, as: "photos" },
                  { model: Pet, as: "pet" },
                  { model: Brand, as: "brand" },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.json(orders);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const orders = await OrderItem.findAll({
        include: [
          {
            model: OrderProduct,
            as: "products",
            include: [
              {
                model: Product,
                include: [
                  { model: ProductPhoto, as: "photos" },
                  { model: Pet, as: "pet" },
                  { model: Brand, as: "brand" },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      return res.json(orders);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getOne(req, res) {
    const { id } = req.params;
    const order = await OrderItem.findOne({
      where: { id },
      include: [
        {
          model: OrderProduct,
          as: "products",
          include: [
            {
              model: Product,
              include: [
                { model: ProductPhoto, as: "photos" },
                { model: Pet, as: "pet" },
                { model: Brand, as: "brand" },
              ],
            },
          ],
        },
      ],
    });

    return res.json(order);
  }

  async delete(req, res, next) {
    try {
      const { id } = req.query;

      if (!id) {
        return next(ApiError.badRequest("Заказ с таким id не найден"));
      }

      await OrderItem.destroy({
        where: { id },
      });

      return res.json("Заказ удален");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new OrderController();
