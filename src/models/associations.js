const Category = require("./category");
const Product = require("./product");
const Tag = require("./tag");

function setupAssociations() {
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
    as: "tags",
    foreignKey: "productId",
  });
  Tag.belongsToMany(Product, {
    through: "ProductTags",
    as: "products",
    foreignKey: "tagId",
  });
}

module.exports = setupAssociations;
