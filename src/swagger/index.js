const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "API documentation for the project",
  },
};

const options = {
  swaggerDefinition: swaggerDocument,
  apis: ["./src/app.js", "./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
