const { Sequelize } = require("sequelize");
const path = require("node:path");

const config = require(__dirname + "/../config/config.json");
const env = process.env.NODE_ENV || "development";
const sequelize = new Sequelize(config[env]);

module.exports = sequelize;
