import { Sequelize } from "sequelize";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, "../config/config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

const env = process.env.NODE_ENV || "development";
const sequelize = new Sequelize(config[env]);

export default sequelize;
