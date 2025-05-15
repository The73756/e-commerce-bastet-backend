require("multer");
const ApiError = require("../error/ApiError");
const {Op} = require("sequelize");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const {
  Product,
  ProductInfo,
  ProductPhoto,
  Type,
  Brand, Tag, Rating, User,
} = require("../models/models");

const includeArr = [
  {model: ProductPhoto, as: "photos"},
  {model: Type, as: "type"},
  {model: Brand, as: "brand"},
  {model: Tag, as: "tag"},
];

class ProductController {
  async create(req, res, next) {
    try {
      let {name, price, brandId, typeId, tagId, info, description, quantity} = req.body;
      const isExist = await Product.findOne({where: {name}});
      const images = req.files;
      const imageNames = [];

      if (isExist) {
        return next(
          ApiError.badRequest("Товар с таким названием уже существует")
        );
      }

      if (!images) {
        return next(ApiError.badRequest("Нет изображений"));
      }

      const product = await Product.create({
        name,
        price,
        brandId,
        typeId,
        tagId: tagId || null,
        description,
        quantity: quantity !== undefined ? quantity : 0,
      });

      if (images.img.length > 1) {
        images.img.forEach((image) => {
          const fileName = uuid.v4() + ".jpg";
          image.mv(path.resolve(__dirname, "..", "static", fileName));
          imageNames.push(fileName);
        });
      } else {
        const fileName = uuid.v4() + ".jpg";
        await images.img.mv(path.resolve(__dirname, "..", "static", fileName));
        imageNames.push(fileName);
      }

      imageNames.forEach((imageName) => {
        ProductPhoto.create({
          url: imageName,
          productId: product.id,
        });
      });

      if (info) {
        info = JSON.parse(info);

        console.log("info", info);

        info.forEach((i) => {
          ProductInfo.create({
            title: i.title,
            description: i.description,
            productId: product.id,
          });
        });
      }

      return res.json(product);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getGroups(req, res) {
    const types = await Type.findAll({
      order: [
        ['id', 'ASC'],
      ],
      include: {
        model: Product,
        limit: 7,
        include: includeArr,
        as: 'products'
      }
    });
    return res.json(types);
  }

  async getAll(req, res) {
    let {brandId, typeId, limit, page, search, sort, order} = req.query;
    page = page || 1;
    limit = limit || 9;
    sort = sort || "id";
    order = order || "DESC";
    let offset = page * limit - limit;
    search = search || "";
    let products;
    let count;
    let type;

    if (!brandId && !typeId && !search) {
      products = await Product.findAll({
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Product.count();
    }

    if (!brandId && !typeId && search) {
      products = await Product.findAll({
        where: {name: {[Op.iRegexp]: search}},
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Product.count({
        where: {name: {[Op.iRegexp]: search}},
      });
    }

    if (brandId && !typeId && !search) {
      products = await Product.findAll({
        where: {brandId},
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Product.count({
        where: {brandId},
      });
    }

    if (brandId && !typeId && search) {
      products = await Product.findAll({
        where: {brandId, name: {[Op.iRegexp]: search}},
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Product.count({
        where: {brandId, name: {[Op.iRegexp]: search}},
      });
    }

    if (!brandId && typeId && !search) {
      products = await Product.findAll({
        where: {typeId},
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Product.count({
        where: {typeId},
      });
    }

    if (!brandId && typeId && search) {
      products = await Product.findAll({
        where: {typeId, name: {[Op.iRegexp]: search}},
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Product.count({
        where: {typeId, name: {[Op.iRegexp]: search}},
      });
    }

    if (brandId && typeId && !search) {
      products = await Product.findAll({
        where: {typeId, brandId},
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Product.count({
        where: {typeId, brandId},
      });
    }

    if (brandId && typeId && search) {
      products = await Product.findAll({
        where: {typeId, brandId, name: {[Op.iRegexp]: search}},
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Product.count({
        where: {typeId, brandId, name: {[Op.iRegexp]: search}},
      });
    }

    return res.json({rows: products, count});
  }

  async getOne(req, res) {
    const {id} = req.params;
    const product = await Product.findOne({
      where: {id},
      include: [
        {
          model: ProductInfo,
          as: "info",
        },
        {
          model: Rating,
          include: [
            { model: User, as: "user" },
          ],
          as: "ratings"
        },
        ...includeArr
      ],
    });

    return res.json(product);
  }

  async update(req, res, next) {
    try {
      const {id} = req.params;
      const {name, price, brandId, typeId, tagId, info, description, quantity} = req.body;
      const images = req.files;
      const imageNames = [];

      const product = await Product.findOne({where: {id}});
      if (!product) {
        return next(ApiError.badRequest("Товар не найден"));
      }

      if (name && name !== product.name) {
        const isNameTaken = await Product.findOne({where: {name}});
        if (isNameTaken) {
          return next(ApiError.badRequest("Товар с таким названием уже существует"));
        }
      }

      await product.update({
        name: name || product.name,
        price: price !== undefined ? price : product.price,
        brandId: brandId || product.brandId,
        typeId: typeId || product.typeId,
        tagId: tagId !== undefined ?
          (tagId === "null" ? null : tagId) :
          product.tagId,
        description: description || product.description,
        quantity: quantity !== undefined ? quantity : product.quantity,
      });

      if (images?.img) {
        await ProductPhoto.destroy({where: {productId: id}});

        if (Array.isArray(images.img)) {
          for (const image of images.img) {
            const fileName = uuid.v4() + ".jpg";
            await image.mv(path.resolve(__dirname, "..", "static", fileName));
            imageNames.push(fileName);
          }
        } else {
          const fileName = uuid.v4() + ".jpg";
          await images.img.mv(path.resolve(__dirname, "..", "static", fileName));
          imageNames.push(fileName);
        }

        for (const imageName of imageNames) {
          await ProductPhoto.create({
            url: imageName,
            productId: product.id,
          });
        }
      }

      if (info) {
        await ProductInfo.destroy({where: {productId: id}}); // Удаляем старую инфу
        const parsedInfo = JSON.parse(info);

        for (const i of parsedInfo) {
          await ProductInfo.create({
            title: i.title,
            description: i.description,
            productId: product.id,
          });
        }
      }

      return res.json(product);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const {id} = req.params;
      const product = await Product.findOne({
        where: {id},
        include: [{model: ProductPhoto, as: "photos"}],
      });

      if (!product) {
        return next(ApiError.badRequest("Товар не найден"));
      }

      if (product.photos.length > 0) {
        product.photos.forEach((photo) => {
          fs.unlink(
            path.resolve(__dirname, "..", "static", photo.url),
            (err) => {
              err && console.log(err);
            }
          );
        });
      }

      await Product.destroy({where: {id}});

      return res.json("Товар удален");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new ProductController();
