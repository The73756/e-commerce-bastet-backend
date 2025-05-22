const {
  Order,
  OrderProduct,
  Product,
  ProductPhoto,
  Type,
  Brand, OrderStatus, Tag, OrderType,
} = require("../models/models");
const ApiError = require("../error/ApiError");

class OrderController {
  async create(req, res, next) {
    try {
      let {
        products,
        userId,
        orderTypeId,
        orderStatusId,
        price,
        street,
        house,
        appartament,
        intercom,
        phone,
        comment,
        date,
        time
      } = req.body;

      const order = await Order.create({
        userId,
        orderTypeId,
        orderStatusId,
        status: " ",
        price,
        street,
        house,
        appartament,
        intercom,
        phone,
        comment,
        date,
        time
      });

      if (products) {
        products = JSON.parse(products);
        products.forEach((i) => {
          OrderProduct.create({
            orderId: order.id,
            productId: i.productId,
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
      const {id} = req.params;
      const {orderStatusId} = req.body;
      const order = await Order.findOne({
        where: {id},
      });

      if (!order) {
        return next(ApiError.badRequest("Заказ не найден"));
      }

      const statusExists = await OrderStatus.findByPk(orderStatusId);
      if (!statusExists) {
        return next(ApiError.badRequest("Указанный статус не существует"));
      }

      await Order.update({orderStatusId}, {where: {id}});
      return res.json("Статус заказа обновлен");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAllOfUser(req, res, next) {
    try {
      const {userId} = req.params;

      const orders = await Order.findAll({
        where: {userId},
        include: [
          {
            model: OrderProduct,
            as: "products",
            include: [
              {
                model: Product,
                include: [
                  {model: ProductPhoto, as: "photos"},
                  {model: Type, as: "type"},
                  {model: Brand, as: "brand"},
                  {model: Tag, as: "tag"},
                ],
              },
            ],
          },
          {
            model: OrderStatus,
            as: "orderStatus",
          },
          {
            model: OrderType,
            as: "orderType",
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
      const orders = await Order.findAll({
        include: [
          {
            model: OrderProduct,
            as: "products",
            include: [
              {
                model: Product,
                include: [
                  {model: ProductPhoto, as: "photos"},
                  {model: Type, as: "type"},
                  {model: Brand, as: "brand"},
                  {model: Tag, as: "tag"},
                ],
              }
            ],
          },
          {
            model: OrderStatus,
            as: "orderStatus",
          },
          {
            model: OrderType,
            as: "orderType",
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
    const {id} = req.params;
    const order = await Order.findOne({
      where: {id},
      include: [
        {
          model: OrderProduct,
          as: "products",
          include: [
            {
              model: Product,
              include: [
                {model: ProductPhoto, as: "photos"},
                {model: Type, as: "type"},
                {model: Brand, as: "brand"},
                {model: Tag, as: "tag"},
              ],
            }
          ],
        },
        {
          model: OrderStatus,
          as: "orderStatus",
        },
        {
          model: OrderType,
          as: "orderType",
        },
      ],
    });

    return res.json(order);
  }

  async delete(req, res, next) {
    try {
      const {id} = req.params;

      if (!id) {
        return next(ApiError.badRequest("Заказ с таким id не найден"));
      }

      await Order.destroy({
        where: {id},
      });

      return res.json("Заказ удален");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new OrderController();
