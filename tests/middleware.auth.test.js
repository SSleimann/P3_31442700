const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../src/models/user");
const authenticateToken = require("../src/middleware/auth");

jest.mock("jsonwebtoken");
jest.mock("../src/models/user");

const app = express();
app.use("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

describe("authenticateToken middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("should return 401 when no authorization header is provided", async () => {
    const response = await request(app).get("/protected");
    expect(response.status).toBe(401);
  });

  it("should return 401 when authorization header has no token", async () => {
    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer");
    expect(response.status).toBe(401);
  });

  it("should return 403 when JWT verification fails", async () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("Invalid token"), null);
    });

    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(403);
  });

  it("should return 403 when user is not found in database", async () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { sub: "user-id" });
    });
    User.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(403);
    expect(User.findByPk).toHaveBeenCalledWith("user-id");
  });

  it("should return 500 when database query fails", async () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { sub: "user-id" });
    });
    User.findByPk.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(500);
  });

  it("should authenticate successfully and call next middleware", async () => {
    const mockUser = { id: "user-id", email: "test@example.com" };
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { sub: "user-id" });
    });
    User.findByPk.mockResolvedValue(mockUser);

    const response = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Protected route accessed");
    expect(response.body.user).toEqual(mockUser);
  });
});
