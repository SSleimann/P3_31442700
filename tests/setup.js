import sequelize from "../src/config/database.js";
import setupAssociations from "../src/models/associations.js";

beforeAll(async () => {
  setupAssociations();
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});
