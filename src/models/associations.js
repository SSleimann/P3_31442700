import Category from "./category.js";
import Product from "./product.js";
import Tag from "./tag.js";
import User from "./user.js";
import Order from "./orders.js";
import OrderItem from "./orderItem.js";

let associationsInitialized = false;

function setupAssociations() {
  if (associationsInitialized) return;
  associationsInitialized = true;

  // One to many: Category has many Products
  Category.hasMany(Product, {
    foreignKey: "categoryId",
    as: "products",
    onDelete: "CASCADE",
  });
  Product.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category",
  });

  // Many to many: Product belongs to many Tags
  Product.belongsToMany(Tag, {
    through: "ProductTags",
    as: "productTags",
    foreignKey: "productId",
  });
  Tag.belongsToMany(Product, {
    through: "ProductTags",
    as: "tagProducts",
    foreignKey: "tagId",
  });

  // One to many: User has many Orders
  User.hasMany(Order, {
    foreignKey: "userId",
    as: "orders",
    onDelete: "CASCADE",
  });
  Order.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // Many to many: OrderItem between Order and Product
  Order.belongsToMany(Product, {
    through: OrderItem,
    as: "orderProducts",
    foreignKey: "orderId",
  });
  Product.belongsToMany(Order, {
    through: OrderItem,
    as: "productOrders",
    foreignKey: "productId",
  });

  // Order has many OrderItems
  Order.hasMany(OrderItem, {
    foreignKey: "orderId",
    as: "orderItems",
    onDelete: "RESTRICT",
  });

  OrderItem.belongsTo(Order, {
    foreignKey: "orderId",
    as: "order",
  });

  Product.hasMany(OrderItem, {
    foreignKey: "productId",
    as: "orderItems",
    onDelete: "RESTRICT",
  });

  OrderItem.belongsTo(Product, {
    foreignKey: "productId",
    as: "product",
  });
}

export default setupAssociations;
