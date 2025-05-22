const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  surname: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING, unique: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
});

const Basket = sequelize.define("basket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, unique: true },
});

const BasketProduct = sequelize.define("basket_product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  basketId: { type: DataTypes.INTEGER },
  productId: { type: DataTypes.INTEGER },
  count: { type: DataTypes.INTEGER },
});

const Favorite = sequelize.define("favorite", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, unique: true },
});

const FavoriteProduct = sequelize.define("favorite_product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  favoriteId: { type: DataTypes.INTEGER },
  productId: { type: DataTypes.INTEGER },
});

const OrderType = sequelize.define("order_type", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER },
});

const OrderStatus = sequelize.define("order_status", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

const Order = sequelize.define("order", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER },
  orderTypeId: { type: DataTypes.INTEGER },
  orderStatusId: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  street: { type: DataTypes.STRING, allowNull: false },
  house: { type: DataTypes.STRING, allowNull: false },
  appartament: { type: DataTypes.STRING, allowNull: false },
  intercom: { type: DataTypes.BOOLEAN, defaultValue: true },
  phone: { type: DataTypes.STRING },
  comment: { type: DataTypes.STRING },
  date: { type: DataTypes.DATE },
  time: { type: DataTypes.TIME },
});

const OrderProduct = sequelize.define("order_product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderId: { type: DataTypes.INTEGER },
  productId: { type: DataTypes.INTEGER },
  count: { type: DataTypes.INTEGER },
});

const Product = sequelize.define("product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  rating: { type: DataTypes.DOUBLE, defaultValue: 0 },
  description: { type: DataTypes.STRING, allowNull: false },
  typeId: { type: DataTypes.INTEGER },
  brandId: { type: DataTypes.INTEGER },
  tagId: { type: DataTypes.INTEGER },
});

const Type = sequelize.define("type", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Brand = sequelize.define("brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Tag = sequelize.define("tag", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Rating = sequelize.define("rating", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER },
  rate: { type: DataTypes.DOUBLE, allowNull: false },
  comment: { type: DataTypes.STRING },
  productId: { type: DataTypes.INTEGER, allowNull: false },
});

const ProductInfo = sequelize.define("product_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
});

const ProductPhoto = sequelize.define("product_photo", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  url: { type: DataTypes.STRING, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
});

const TypeBrand = sequelize.define("type_brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

User.hasOne(Basket);
Basket.belongsTo(User);

User.hasOne(Favorite);
Favorite.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User, { as: "user" });

Basket.hasMany(BasketProduct);
BasketProduct.belongsTo(Basket);

Favorite.hasMany(FavoriteProduct);
FavoriteProduct.belongsTo(Favorite);

User.hasMany(Order);
Order.belongsTo(User);

OrderStatus.hasMany(Order);
Order.belongsTo(OrderStatus, { as: "orderStatus" });

OrderType.hasMany(Order);
Order.belongsTo(OrderType, { as: "orderType" });

Order.hasMany(OrderProduct, { as: "products" });
OrderProduct.belongsTo(Order);

Type.hasMany(Product);
Product.belongsTo(Type);

Brand.hasMany(Product);
Product.belongsTo(Brand);

Tag.hasMany(Product);
Product.belongsTo(Tag);

Product.hasMany(Rating, { as: "ratings" });
Rating.belongsTo(Product, { onDelete: "cascade" });

Product.hasMany(BasketProduct);
BasketProduct.belongsTo(Product);

Product.hasMany(FavoriteProduct);
FavoriteProduct.belongsTo(Product);

Product.hasMany(OrderProduct);
OrderProduct.belongsTo(Product);

Product.hasMany(ProductInfo, { as: "info" });
ProductInfo.belongsTo(Product, { onDelete: "cascade" });

Product.hasMany(ProductPhoto, { as: "photos" });
ProductPhoto.belongsTo(Product, { onDelete: "cascade" });

Type.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Type, { through: TypeBrand });

module.exports = {
  User,
  Basket,
  BasketProduct,
  Favorite,
  FavoriteProduct,
  OrderType,
  OrderStatus,
  Order,
  OrderProduct,
  Product,
  Type,
  Brand,
  Tag,
  Rating,
  ProductInfo,
  ProductPhoto,
  TypeBrand
};
