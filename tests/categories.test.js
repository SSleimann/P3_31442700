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

describe("GET /categories/:id", () => {
  let category;
  let token;

  beforeEach(async () => {
    await Category.destroy({ where: {} });
    await User.destroy({ where: {} });
    const auth = await createAuthToken();
    token = auth.token;
    category = await Category.create({
      name: "Electronics",
      description: "Electronic items",
    });
  });

  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).get(`/categories/${category.id}`);
    expect(res.statusCode).toBe(401);
  });

  it("should return 404 if category does not exist", async () => {
    const res = await request(app)
      .get(`/categories/non-existent-id`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  it("should return the category if it exists", async () => {
    const res = await request(app)
      .get(`/categories/${category.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.data).toHaveProperty("id", category.id);
    expect(res.body.data).toHaveProperty("name", category.name);
  });
});

describe("POST /categories", () => {
  let token;

  beforeEach(async () => {
    await Category.destroy({ where: {} });
    await User.destroy({ where: {} });
    const auth = await createAuthToken();
    token = auth.token;
  });

  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).post("/categories").send({
      name: "New Category",
      description: "Category description",
    });
    expect(res.statusCode).toBe(401);
  });

  it("should create a new category", async () => {
    const res = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "New Category",
        description: "Category description",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.data).toHaveProperty("name", "New Category");
  });

  it("should return 400 for invalid input", async () => {
    const res = await request(app)
      .post("/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Missing description field",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("status", "error");
    expect(res.body).toHaveProperty(
      "message",
      "Name and description are required"
    );
  });
});

describe("PUT /categories/:id", () => {
  let category;
  let token;

  beforeEach(async () => {
    await Category.destroy({ where: {} });
    await User.destroy({ where: {} });
    const auth = await createAuthToken();
    token = auth.token;
    category = await Category.create({
      name: "Electronics",
      description: "Electronic items",
    });
  });

  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).put(`/categories/${category.id}`).send({
      name: "Updated Name",
      description: "Updated description",
    });
    expect(res.statusCode).toBe(401);
  });

  it("should update the category", async () => {
    const res = await request(app)
      .put(`/categories/${category.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Name",
        description: "Updated description",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.data).toHaveProperty("name", "Updated Name");
  });

  it("should return 400 for invalid input", async () => {
    const res = await request(app)
      .put(`/categories/${category.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Only name provided",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("status", "error");
    expect(res.body).toHaveProperty(
      "message",
      "Name and description are required"
    );
  });
});

describe("DELETE /categories/:id", () => {
  let category;
  let token;

  beforeEach(async () => {
    await Category.destroy({ where: {} });
    await User.destroy({ where: {} });
    const auth = await createAuthToken();
    token = auth.token;
    category = await Category.create({
      name: "Electronics",
      description: "Electronic items",
    });
  });

  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).delete(`/categories/${category.id}`);
    expect(res.statusCode).toBe(401);
  });

  it("should delete the category", async () => {
    const res = await request(app)
      .delete(`/categories/${category.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "success");
  });

  it("should return 404 if category does not exist", async () => {
    const res = await request(app)
      .delete(`/categories/non-existent-id`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});
