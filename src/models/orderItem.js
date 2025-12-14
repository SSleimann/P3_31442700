import db from "../config/database.js";
import { DataTypes } from "sequelize";

const OrderItem = db.define(
  "order_item",
  {
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: true,
        min: 1,
      },
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
    tableName: "order_items",
  }
);

export default OrderItem;
