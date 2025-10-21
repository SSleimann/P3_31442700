const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/index");

const db = require("./config/database");
const userRoutes = require("./routes/users");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

app.use("/users", userRoutes);

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
app.get("/about", async (req, res) => {
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
app.get("/ping", async (req, res) => {
  res.status(200).send("");
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Database health check endpoint.
 *     description: Checks the database connection status.
 *     responses:
 *       200:
 *         description: Database is connected.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Response status.
 *                   example: ok
 *                 database:
 *                   type: string
 *                   description: Database connection status.
 *                   example: connected
 *       500:
 *         description: Database is disconnected.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Response status.
 *                   example: error
 *                 database:
 *                   type: string
 *                   description: Database connection status.
 *                   example: disconnected
 */
app.get("/health", async (req, res) => {
  try {
    await db.authenticate();

    res.status(200).json({ status: "ok", database: "connected" });
  } catch {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

module.exports = app;
