const express = require("express");

const app = express();

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

app.get("/ping", (req, res) => {
  res.status(200).send("");
});

module.exports = app;
