import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Order = db.define(
	"order",
	{
		id: {
			type: DataTypes.STRING,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
		},
		userId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		totalAmount: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
			validate: {
				isDecimal: true,
				min: 0,
			},
		},
		status: {
			type: DataTypes.ENUM("pending", "completed", "canceled", "failed"),
			allowNull: false,
			defaultValue: "pending",
		},
	},
	{
		timestamps: true,
		tableName: "orders",
	}
);

export default Order;
