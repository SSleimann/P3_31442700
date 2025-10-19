const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/index");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Retrieve developer information.
 *     description: Returns information about the developer including full name, ID number, and section.
 *     responses:
 *       200:
 *         description: Developer information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Response status.
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     nombreCompleto:
 *                       type: string
 *                       description: The developer's full name.
 *                       example: Sleiman José Orocua Moujalli
 *                     cedula:
 *                       type: string
 *                       description: The developer's ID number.
 *                       example: "31442700"
 *                     seccion:
 *                       type: string
 *                       description: The developer's section.
 *                       example: "02"
 */
app.get("/about", function (req, res) {
  res.status(200).json({
    status: "success",
    data: {
      nombreCompleto: "Sleiman José Orocua Moujalli",
      cedula: "31442700",
      seccion: "02",
    },
  });
});

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Health check endpoint.
 *     description: Simple health check that returns an empty response with 200 status.
 *     responses:
 *       200:
 *         description: Service is healthy and running.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: ""
 */
app.get("/ping", (req, res) => {
  res.status(200).send("");
});

module.exports = app;
