import Category from "./category.js";
import Product from "./product.js";
import Tag from "./tag.js";

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
}

module.exports = setupAssociations;
