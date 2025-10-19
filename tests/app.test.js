// app.test.js
const request = require("supertest");
const app = require("../src/app");

describe("GET /ping", () => {
  it("should answer with an empty response and status 200", async () => {
    const res = await request(app).get("/ping").expect(200);

    expect(res.body).toEqual({});
  });
});

describe("GET /about", () => {
  it("should return personal information with status 200", async () => {
    const res = await request(app).get("/about").expect(200);
    expect(res.body).toEqual({
      status: "success",
      data: {
        nombreCompleto: "Sleiman José Orocua Moujalli",
        cedula: "31442700",
        seccion: "02",
      },
    });
  });
});
