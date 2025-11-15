import db from "../config/database.js";
import { DataTypes } from "sequelize";
import slugify from "slugify";

const Product = db.define(
  "product",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 150],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
      },
      defaultValue: 0,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    hooks: {
      beforeValidate: (product) => {
        if (product.name) {
          product.slug = slugify(`${product.name}-${product.id}`, {
            lower: true,
            strict: true,
          });
        }
      },
      beforeUpdate: (product) => {
        if (product.changed("name")) {
          product.slug = slugify(`${product.name}-${product.id}`, {
            lower: true,
            strict: true,
          });
        }
      },
    },
  }
);

export default Product;
