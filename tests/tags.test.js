import { expect, it, describe, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.js";

import User from "../src/models/user.js";
import Tag from "../src/models/tag.js";
import { hashPassword } from "../src/utils/password.js";

const createAuthToken = async () => {
  const user = await User.create({
    first_name: "Test",
    last_name: "User",
    email: `test.user.${Date.now()}@example.com`,
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

describe("GET /tags", () => {
  beforeEach(async () => {
    await Tag.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).get("/tags");
    expect(res.statusCode).toBe(401);
  });

  it("should return an empty list when no tags exist", async () => {
    const { token } = await createAuthToken();

    const res = await request(app)
      .get("/tags")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.data).toEqual([]);
  });

  it("should return a list of tags", async () => {
    const { token } = await createAuthToken();
    await Tag.create({ name: "Node" });
    await Tag.create({ name: "Express" });

    const res = await request(app)
      .get("/tags")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.data.length).toBe(2);
  });
});

describe("GET /tags/:id", () => {
  let tag;
  let token;

  beforeEach(async () => {
    await Tag.destroy({ where: {} });
    await User.destroy({ where: {} });
    const auth = await createAuthToken();
    token = auth.token;
    tag = await Tag.create({ name: "Database" });
  });

  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).get(`/tags/${tag.id}`);
    expect(res.statusCode).toBe(401);
  });

  it("should return 404 if tag does not exist", async () => {
    const res = await request(app)
      .get(`/tags/non-existent-id`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });

  it("should return the tag if it exists", async () => {
    const res = await request(app)
      .get(`/tags/${tag.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.data).toHaveProperty("id", tag.id);
    expect(res.body.data).toHaveProperty("name", tag.name);
  });
});

describe("POST /tags", () => {
  let token;

  beforeEach(async () => {
    await Tag.destroy({ where: {} });
    await User.destroy({ where: {} });
    const auth = await createAuthToken();
    token = auth.token;
  });

  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).post("/tags").send({ name: "New Tag" });
    expect(res.statusCode).toBe(401);
  });

  it("should create a new tag", async () => {
    const res = await request(app)
      .post("/tags")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "New Tag" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.data).toHaveProperty("name", "New Tag");
  });

  it("should return 400 for invalid input", async () => {
    const res = await request(app)
      .post("/tags")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("status", "error");
    expect(res.body).toHaveProperty("message", "Name is required");
  });
});

describe("PUT /tags/:id", () => {
  let tag;
  let token;

  beforeEach(async () => {
    await Tag.destroy({ where: {} });
    await User.destroy({ where: {} });
    const auth = await createAuthToken();
    token = auth.token;
    tag = await Tag.create({ name: "Old Tag" });
  });

  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).put(`/tags/${tag.id}`).send({ name: "X" });
    expect(res.statusCode).toBe(401);
  });

  it("should update the tag", async () => {
    const res = await request(app)
      .put(`/tags/${tag.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Tag" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.data).toHaveProperty("name", "Updated Tag");
  });

  it("should return 400 for invalid input", async () => {
    const res = await request(app)
      .put(`/tags/${tag.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("status", "error");
    expect(res.body).toHaveProperty("message", "Name is required");
  });
});

describe("DELETE /tags/:id", () => {
  let tag;
  let token;

  beforeEach(async () => {
    await Tag.destroy({ where: {} });
    await User.destroy({ where: {} });
    const auth = await createAuthToken();
    token = auth.token;
    tag = await Tag.create({ name: "ToDelete" });
  });

  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).delete(`/tags/${tag.id}`);
    expect(res.statusCode).toBe(401);
  });

  it("should delete the tag", async () => {
    const res = await request(app)
      .delete(`/tags/${tag.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "success");
  });

  it("should return 404 if tag does not exist", async () => {
    const res = await request(app)
      .delete(`/tags/non-existent-id`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});
