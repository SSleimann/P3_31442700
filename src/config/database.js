import { Sequelize } from "sequelize";
import config from "../config/config.json" assert { type: "json" };

const config = require(__dirname + "/../config/config.json");
const env = process.env.NODE_ENV || "development";
const sequelize = new Sequelize(config[env]);

export default sequelize;
