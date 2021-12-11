var DataTypes = require("sequelize").DataTypes;
var _banner = require("./banner");
var _categories = require("./categories");
var _order_items = require("./order_items");
var _orders = require("./orders");
var _product_categories = require("./product_categories");
var _product_images = require("./product_images");
var _product_reviews = require("./product_reviews");
var _products = require("./products");
var _users = require("./users");

function initModels(sequelize) {
  var banner = _banner(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var order_items = _order_items(sequelize, DataTypes);
  var orders = _orders(sequelize, DataTypes);
  var product_categories = _product_categories(sequelize, DataTypes);
  var product_images = _product_images(sequelize, DataTypes);
  var product_reviews = _product_reviews(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  categories.belongsToMany(products, { as: 'product_id_products_product_categories', through: product_categories, foreignKey: "category_id", otherKey: "product_id" });
  orders.belongsToMany(products, { as: 'product_id_products', through: order_items, foreignKey: "order_id", otherKey: "product_id" });
  products.belongsToMany(categories, { as: 'category_id_categories', through: product_categories, foreignKey: "product_id", otherKey: "category_id" });
  products.belongsToMany(orders, { as: 'order_id_orders', through: order_items, foreignKey: "product_id", otherKey: "order_id" });
  products.belongsToMany(users, { as: 'user_id_users', through: product_reviews, foreignKey: "product_id", otherKey: "user_id" });
  users.belongsToMany(products, { as: 'product_id_products_product_reviews', through: product_reviews, foreignKey: "user_id", otherKey: "product_id" });
  banner.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  categories.hasMany(banner, { as: "banners", foreignKey: "category_id"});
  product_categories.belongsTo(categories, { as: "category", foreignKey: "category_id"});
  categories.hasMany(product_categories, { as: "product_categories", foreignKey: "category_id"});
  order_items.belongsTo(orders, { as: "order", foreignKey: "order_id"});
  orders.hasMany(order_items, { as: "order_items", foreignKey: "order_id"});
  banner.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(banner, { as: "banners", foreignKey: "product_id"});
  order_items.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(order_items, { as: "order_items", foreignKey: "product_id"});
  product_categories.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(product_categories, { as: "product_categories", foreignKey: "product_id"});
  product_images.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(product_images, { as: "product_images", foreignKey: "product_id"});
  product_reviews.belongsTo(products, { as: "product", foreignKey: "product_id"});
  products.hasMany(product_reviews, { as: "product_reviews", foreignKey: "product_id"});
  categories.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(categories, { as: "categories", foreignKey: "user_id"});
  orders.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(orders, { as: "orders", foreignKey: "user_id"});
  product_reviews.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(product_reviews, { as: "product_reviews", foreignKey: "user_id"});
  products.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(products, { as: "products", foreignKey: "user_id"});

  return {
    banner,
    categories,
    order_items,
    orders,
    product_categories,
    product_images,
    product_reviews,
    products,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
