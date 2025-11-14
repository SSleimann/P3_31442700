import { expect, it, describe, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.js";

import User from "../src/models/user.js";
import Category from "../src/models/category.js";
import { hashPassword } from "../src/utils/password.js";

const createAuthToken = async () => {
  const user = await User.create({
    first_name: "Test",
    last_name: "User",
    email: "test.user2@example.com",
    password: await hashPassword("password123"),
  });

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return { token, user };
};

describe("GET /categories", () => {
  beforeEach(async () => {
    await Category.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).get("/categories");
    expect(res.statusCode).toBe(401);
  });

  it("should return an empty list when no categories exist", async () => {
    const { token } = await createAuthToken();

    const res = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.data).toEqual([]);
  });

  it("should return a list of categories", async () => {
    const { token } = await createAuthToken();
    await Category.create({ name: "Books", description: "All kinds of books" });
    await Category.create({
      name: "Clothing",
      description: "Apparel and accessories",
    });
    const res = await request(app)
      .get("/categories")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.data.length).toBe(2);
  });
});
