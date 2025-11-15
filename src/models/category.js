import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Category = db.define("category", {
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
      len: [2, 100],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default Category;
