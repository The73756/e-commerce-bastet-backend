// const sequelize = require("../db");
// const { DataTypes } = require("sequelize");
//
// const User = sequelize.define("user", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   name: { type: DataTypes.STRING, unique: true },
//   email: { type: DataTypes.STRING, unique: true },
//   password: { type: DataTypes.STRING },
//   role: { type: DataTypes.STRING, defaultValue: "USER" },
// });
//
// const Basket = sequelize.define("basket", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   userId: { type: DataTypes.INTEGER, unique: true },
// });
//
// const BasketProduct = sequelize.define("basket_product", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   basketId: { type: DataTypes.INTEGER },
//   productId: { type: DataTypes.INTEGER },
//   count: { type: DataTypes.INTEGER },
// });
//
// const Favorite = sequelize.define("favorite", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   userId: { type: DataTypes.INTEGER, unique: true },
// });
//
// const FavoriteProduct = sequelize.define("favorite_product", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   favoriteId: { type: DataTypes.INTEGER },
//   productId: { type: DataTypes.INTEGER },
// });
//
// const Order = sequelize.define("order", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   userId: { type: DataTypes.INTEGER, unique: true },
// });
//
// const OrderItem = sequelize.define("order_item", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   orderId: { type: DataTypes.INTEGER },
//   status: { type: DataTypes.STRING, allowNull: false },
//   price: { type: DataTypes.INTEGER, allowNull: false },
//   recipient: { type: DataTypes.STRING, allowNull: false },
//   recipientEmail: { type: DataTypes.STRING, allowNull: false },
//   address: { type: DataTypes.STRING, allowNull: false },
// });
//
// const OrderProduct = sequelize.define("order_product", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   orderItemId: { type: DataTypes.INTEGER },
//   productId: { type: DataTypes.INTEGER },
//   count: { type: DataTypes.INTEGER },
// });
//
// const Product = sequelize.define("product", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   name: { type: DataTypes.STRING, unique: true, allowNull: false },
//   price: { type: DataTypes.INTEGER, allowNull: false },
//   rating: { type: DataTypes.DOUBLE, defaultValue: 0 },
//   description: { type: DataTypes.STRING, allowNull: false },
// });
//
// const Pet = sequelize.define("pet", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   name: { type: DataTypes.STRING, unique: true, allowNull: false },
// });
//
// const Brand = sequelize.define("brand", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   name: { type: DataTypes.STRING, unique: true, allowNull: false },
// });
//
// const Rating = sequelize.define("rating", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   rate: { type: DataTypes.DOUBLE, allowNull: false },
//   productId: { type: DataTypes.INTEGER, allowNull: false },
// });
//
// const ProductInfo = sequelize.define("product_info", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   title: { type: DataTypes.STRING, allowNull: false },
//   description: { type: DataTypes.STRING, allowNull: false },
//   productId: { type: DataTypes.INTEGER, allowNull: false },
// });
//
// const ProductPhoto = sequelize.define("product_photo", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   url: { type: DataTypes.STRING, allowNull: false },
//   productId: { type: DataTypes.INTEGER, allowNull: false },
// });
//
// const PetBrand = sequelize.define("pet_brand", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
// });
//
// User.hasOne(Basket);
// Basket.belongsTo(User);
//
// User.hasOne(Favorite);
// Favorite.belongsTo(User);
//
// User.hasOne(Order);
// Order.belongsTo(User);
//
// User.hasMany(Rating);
// Rating.belongsTo(User);
//
// Basket.hasMany(BasketProduct);
// BasketProduct.belongsTo(Basket);
//
// Favorite.hasMany(FavoriteProduct);
// FavoriteProduct.belongsTo(Favorite);
//
// Order.hasMany(OrderItem);
// OrderItem.belongsTo(Order);
//
// OrderItem.hasMany(OrderProduct, { as: "products" });
// OrderProduct.belongsTo(OrderItem);
//
// Pet.hasMany(Product);
// Product.belongsTo(Pet);
//
// Brand.hasMany(Product);
// Product.belongsTo(Brand);
//
// Product.hasMany(Rating);
// Rating.belongsTo(Product, { onDelete: "cascade" });
//
// Product.hasMany(BasketProduct);
// BasketProduct.belongsTo(Product);
//
// Product.hasMany(FavoriteProduct);
// FavoriteProduct.belongsTo(Product);
//
// Product.hasMany(OrderProduct);
// OrderProduct.belongsTo(Product);
//
// Product.hasMany(ProductInfo, { as: "info" });
// ProductInfo.belongsTo(Product, { onDelete: "cascade" });
//
// Product.hasMany(ProductPhoto, { as: "photos" });
// ProductPhoto.belongsTo(Product, { onDelete: "cascade" });
//
// Pet.belongsToMany(Brand, { through: PetBrand });
// Brand.belongsToMany(Pet, { through: PetBrand });
//
// module.exports = {
//   User,
//   Basket,
//   BasketProduct,
//   Favorite,
//   FavoriteProduct,
//   Order,
//   OrderItem,
//   OrderProduct,
//   Product,
//   Pet,
//   Brand,
//   Rating,
//   PetBrand,
//   ProductInfo,
//   ProductPhoto,
// };
