require("multer");
const ApiError = require("../error/ApiError");
const { Op } = require("sequelize");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const {
  Product,
  ProductInfo,
  ProductPhoto,
  Pet,
  Brand,
} = require("../models/models");

const includeArr = [
  { model: ProductPhoto, as: "photos" },
  { model: Pet, as: "pet" },
  { model: Brand, as: "brand" },
];

class ProductController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, petId, info, description } = req.body;
      const isExist = await Product.findOne({ where: { name } });
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
        petId,
        description,
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

  async getAll(req, res) {
    let { brandId, petId, limit, page, search, sort, order } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    search = search || "";
    let products;
    let count;

    if (!brandId && !petId && !search) {
      products = await Product.findAll({
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Product.count();
    }

    if (!brandId && !petId && search) {
      products = await Product.findAll({
        where: { name: { [Op.iRegexp]: search } },
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Product.count({
        where: { name: { [Op.iRegexp]: search } },
      });
    }

    if (brandId && !petId && !search) {
      products = await Product.findAll({
        where: { brandId },
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Product.count({
        where: { brandId },
      });
    }

    if (brandId && !petId && search) {
      products = await Product.findAll({
        where: { brandId, name: { [Op.iRegexp]: search } },
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Product.count({
        where: { brandId, name: { [Op.iRegexp]: search } },
      });
    }

    if (!brandId && petId && !search) {
      products = await Product.findAll({
        where: { petId },
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Product.count({
        where: { petId },
      });
    }

    if (!brandId && petId && search) {
      products = await Product.findAll({
        where: { petId, name: { [Op.iRegexp]: search } },
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Product.count({
        where: { petId, name: { [Op.iRegexp]: search } },
      });
    }

    if (brandId && petId && !search) {
      products = await Product.findAll({
        where: { petId, brandId },
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Product.count({
        where: { petId, brandId },
      });
    }

    if (brandId && petId && search) {
      products = await Product.findAll({
        where: { petId, brandId, name: { [Op.iRegexp]: search } },
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Product.count({
        where: { petId, brandId, name: { [Op.iRegexp]: search } },
      });
    }

    return res.json({ rows: products, count });
  }

  async getOne(req, res) {
    const { id } = req.params;
    const product = await Product.findOne({
      where: { id },
      include: [
        {
          model: ProductInfo,
          as: "info",
        },
        { model: ProductPhoto, as: "photos" },
      ],
    });

    return res.json(product);
  }

  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const product = await Product.findOne({
        where: { id },
        include: [{ model: ProductPhoto, as: "photos" }],
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

      await Product.destroy({ where: { id } });

      return res.json("Товар удален");
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new ProductController();
