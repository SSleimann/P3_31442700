// users.test.js
import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/user.js";

jest.mock("../src/middleware/auth");

import mockAuth from "../src/middleware/auth";

describe("GET /users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockImplementation((req, res, next) => {
      next();
    });
    return User.destroy({ where: {} });
  });

  it("should return 401 if user is not authenticated", async () => {
    mockAuth.mockImplementation((req, res, next) => {
      return res.status(401).json({});
    });
    const res = await request(app).get("/users").expect(401);
    expect(res.body).toEqual({});
  });

  it("should return all users with status 200", async () => {
    await User.create({
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      password: "securepassword",
    });

    const res = await request(app).get("/users").expect(200);
    expect(res.body).toEqual({
      status: "success",
      data: [
        {
          id: expect.any(String),
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
    });
  });

  it("should handle empty users list", async () => {
    const res = await request(app).get("/users").expect(200);
    expect(res.body).toEqual({
      status: "success",
      data: [],
    });
  });
});

describe("GET /users/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockImplementation((req, res, next) => {
      next();
    });
  });

  it("should return 401 if user is not authenticated", async () => {
    mockAuth.mockImplementation((req, res, next) => {
      return res.status(401).json({});
    });
    const res = await request(app).get("/users/some-id").expect(401);
    expect(res.body).toEqual({});
  });

  it("should return a specific user by id with status 200", async () => {
    const user = await User.create({
      first_name: "Jane",
      last_name: "Doe",
      email: "jane.doe@example.com",
      password: "securepassword",
    });

    const res = await request(app).get(`/users/${user.id}`).expect(200);
    expect(res.body).toEqual({
      status: "success",
      data: {
        id: user.id,
        first_name: "Jane",
        last_name: "Doe",
        email: "jane.doe@example.com",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });

    await user.destroy();
  });

  it("should return 404 when user is not found", async () => {
    const res = await request(app)
      .get("/users/1c7bb06d-330f-4173-adb0-936683e3dc6d")
      .expect(404);
    expect(res.body).toEqual({
      status: "error",
      message: "User not found",
    });
  });

  it("should return 400 for invalid user id format", async () => {
    const res = await request(app).get("/users/invalid-id").expect(400);
    expect(res.body).toEqual({
      status: "error",
      message: "Invalid user ID format",
    });
  });
});

describe("POST /users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockImplementation((req, res, next) => {
      next();
    });
    return User.destroy({ where: {} });
  });

  it("should return 401 if user is not authenticated", async () => {
    mockAuth.mockImplementation((req, res, next) => {
      return res.status(401).json({});
    });
    const res = await request(app).post("/users").expect(401);
    expect(res.body).toEqual({});
  });

  it("should create a new user with status 201", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        firstName: "Alice",
        lastName: "Smith",
        email: "alice.smith@example.com",
        password: "securepassword",
      })
      .expect(201);

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

    const userID = res.body.data.id;

    const userInDb = await User.findByPk(userID);
    expect(userInDb).not.toBeNull();
    expect(userInDb.first_name).toBe("Alice");
    expect(userInDb.last_name).toBe("Smith");
    expect(userInDb.email).toBe("alice.smith@example.com");
    expect(userInDb.password).not.toBe("securepassword");
  });

  it("should return 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        firstName: "Bob",
        email: "bob@example.com",
      })
      .expect(400);
  });

  it("should return 400 when email format is invalid", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        firstName: "Charlie",
        lastName: "Brown",
        email: "invalid-email-format",
        password: "securepassword",
      })
      .expect(400);

    expect(res.body).toEqual({
      status: "error",
      message: "Invalid email format",
    });
  });

  it("should return 409 when email already exists", async () => {
    await User.create({
      first_name: "David",
      last_name: "Johnson",
      email: "david.johnson@example.com",
      password: "securepassword",
    });
    const res = await request(app)
      .post("/users")
      .send({
        firstName: "David",
        lastName: "Johnson",
        email: "david.johnson@example.com",
        password: "securepassword",
      })
      .expect(409);

    expect(res.body).toEqual({
      status: "error",
      message: "Email already exists",
    });
  });
});

describe("PUT /users/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockImplementation((req, res, next) => {
      next();
    });
    return User.destroy({ where: {} });
  });

  it("should return 401 if user is not authenticated", async () => {
    mockAuth.mockImplementation((req, res, next) => {
      return res.status(401).json({});
    });
    const res = await request(app).put("/users/some-id").expect(401);
    expect(res.body).toEqual({});
  });

  it("should update an existing user with status 200", async () => {
    const user = await User.create({
      first_name: "Eve",
      last_name: "Adams",
      email: "eve.adams@example.com",
      password: "securepassword",
    });

    const res = await request(app)
      .put(`/users/${user.id}`)
      .send({
        firstName: "Evelyn",
        lastName: "Adams",
        email: "evelyn.adams@example.com",
      })
      .expect(200);

    expect(res.body).toEqual({
      status: "success",
      data: {
        id: user.id,
        first_name: "Evelyn",
        last_name: "Adams",
        email: "evelyn.adams@example.com",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });

    const updatedUser = await User.findByPk(user.id);
    expect(updatedUser.first_name).toBe("Evelyn");
    expect(updatedUser.email).toBe("evelyn.adams@example.com");
  });

  it("should return 404 when user to update is not found", async () => {
    const res = await request(app)
      .put("/users/1c7bb06d-330f-4173-adb0-936683e3dc6d")
      .send({
        firstName: "Non",
        lastName: "Existing",
        email: "non.existing@example.com",
      })
      .expect(404);

    expect(res.body).toEqual({
      status: "error",
      message: "User not found",
    });
  });

  it("should return 400 when missing required fields", async () => {
    const user = await User.create({
      first_name: "Frank",
      last_name: "Miller",
      email: "frank.miller@example.com",
      password: "securepassword",
    });

    const res = await request(app)
      .put(`/users/${user.id}`)
      .send({
        firstName: "Frank",
        lastName: "Miller",
      })
      .expect(400);

    expect(res.body).toEqual({
      status: "error",
      message: "Missing required fields",
    });
  });

  it("should return 400 when email format is invalid", async () => {
    const user = await User.create({
      first_name: "Grace",
      last_name: "Lee",
      email: "grace.lee@example.com",
      password: "securepassword",
    });

    const res = await request(app)
      .put(`/users/${user.id}`)
      .send({
        firstName: "Grace",
        lastName: "Lee",
        email: "invalid-email-format",
      })
      .expect(400);

    expect(res.body).toEqual({
      status: "error",
      message: "Invalid email format",
    });
  });

  it("should return 400 for invalid user id format", async () => {
    const res = await request(app)
      .put("/users/invalid-id-format")
      .send({
        firstName: "George",
        lastName: "Harris",
        email: "george.harris@example.com",
      })
      .expect(400);

    expect(res.body).toEqual({
      status: "error",
      message: "Invalid user ID format",
    });
  });

  it("should return 409 when updating to an existing email", async () => {
    await User.create({
      first_name: "Hannah",
      last_name: "White",
      email: "hannah.white@example.com",
      password: "securepassword",
    });

    const user2 = await User.create({
      first_name: "Ian",
      last_name: "Black",
      email: "ian.black@example.com",
      password: "securepassword",
    });

    const res = await request(app)
      .put(`/users/${user2.id}`)
      .send({
        firstName: "Ian",
        lastName: "Black",
        email: "ian.black@example.com",
      })
      .expect(409);

    expect(res.body).toEqual({
      status: "error",
      message: "Email already exists",
    });
  });
});

describe("DELETE /users/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.mockImplementation((req, res, next) => {
      next();
    });
    return User.destroy({ where: {} });
  });

  it("should return 401 if user is not authenticated", async () => {
    mockAuth.mockImplementation((req, res, next) => {
      return res.status(401).json({});
    });
    const res = await request(app).delete("/users/some-id").expect(401);
    expect(res.body).toEqual({});
  });

  it("should delete an existing user with status 200", async () => {
    const user = await User.create({
      first_name: "Eve",
      last_name: "Adams",
      email: "eve.adams@example.com",
      password: "securepassword",
    });
    const res = await request(app).delete(`/users/${user.id}`).expect(200);
    expect(res.body).toEqual({
      status: "success",
      message: "User deleted successfully",
    });

    const userInDb = await User.findByPk(user.id);
    expect(userInDb).toBeNull();
  });

  it("should return 404 when user to delete is not found", async () => {
    const res = await request(app)
      .delete("/users/922f890d-e193-46d8-ba42-63fed5b91f00")
      .expect(404);

    expect(res.body).toEqual({
      status: "error",
      message: "User not found",
    });
  });

  it("should return 400 for invalid user id format", async () => {
    const res = await request(app)
      .delete("/users/invalid-id-format")
      .expect(400);

    expect(res.body).toEqual({
      status: "error",
      message: "Invalid user ID format",
    });
  });
});
