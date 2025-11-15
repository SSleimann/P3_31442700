// auth.test.js
import { expect, it, describe, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.js";

import User from "../src/models/user.js";
import jwt from "jsonwebtoken";
import { hashPassword } from "../src/utils/password.js";

describe("POST /auth/register", () => {
  beforeEach(() => {
    return User.destroy({ where: {} });
  });

  it("should register a new user and return status 201", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "Alice",
      lastName: "Smith",
      email: "alice.smith@example.com",
      password: "securepassword",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      status: "success",
      data: {
        id: expect.any(String),
        first_name: "Alice",
        last_name: "Smith",
        email: "alice.smith@example.com",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });

    const userInDb = await User.findOne({
      where: { email: "alice.smith@example.com" },
    });
    expect(userInDb).not.toBeNull();
    expect(userInDb.first_name).toBe("Alice");
    expect(userInDb.last_name).toBe("Smith");
    expect(userInDb.email).toBe("alice.smith@example.com");
  });

  it("should return 400 when required fields are missing", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "Bob",
      email: "bob@example.com",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      status: "error",
      message: "All fields are required",
    });
  });

  it("should return 400 for invalid email format", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "Charlie",
      lastName: "Brown",
      email: "invalid-email",
      password: "somepassword",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      status: "error",
      message: "Invalid email format",
    });
  });

  it("should return 409 when email is already in use", async () => {
    // First, create a user
    await User.create({
      first_name: "David",
      last_name: "Johnson",
      email: "david.johnson@example.com",
      password: "anotherpassword",
    });
    const res = await request(app).post("/auth/register").send({
      firstName: "David",
      lastName: "Johnson",
      email: "david.johnson@example.com",
      password: "anotherpassword",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toEqual({
      status: "error",
      message: "Email already in use",
    });
  });
});

describe("POST /auth/login", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    return User.destroy({ where: {} });
  });

  it("should return 400 when email or password is missing", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "alice.smith@example.com",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      status: "error",
      message: "Email and password are required",
    });
  });

  it("should return 401 for invalid credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "alice.smith@example.com",
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      status: "error",
      message: "Invalid email or password",
    });
  });

  it("should login successfully and return a JWT token", async () => {
    process.env.JWT_SECRET = "testsecretkey";

    const user = await User.create({
      first_name: "Eve",
      last_name: "Adams",
      email: "eve.adams@example.com",
      password: await hashPassword("correctpassword"),
    });

    const res = await request(app).post("/auth/login").send({
      email: "eve.adams@example.com",
      password: "correctpassword",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body).toHaveProperty("token");

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded.sub).toBe(user.id);
    expect(decoded).toHaveProperty("email", "eve.adams@example.com");
    expect(decoded).toHaveProperty("iat");
    expect(decoded).toHaveProperty("exp");
  });
});
