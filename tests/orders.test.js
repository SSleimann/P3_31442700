import { expect, it, describe, beforeEach, vi } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.js";
import User from "../src/models/user.js";
import Product from "../src/models/product.js";
import Order from "../src/models/orders.js";
import OrderItem from "../src/models/orderItem.js";
import { hashPassword } from "../src/utils/password.js";

// Mock Payment Strategy
vi.mock("../src/utils/payments.js", () => {
  const CreditCardStrategy = vi.fn();
  CreditCardStrategy.prototype.processPayment = vi
    .fn()
    .mockResolvedValue({ success: true });
  return {
    CreditCardStrategy,
  };
});

const createAuthToken = async () => {
  const user = await User.create({
    first_name: "Order",
    last_name: "Tester",
    email: `order.test.${Date.now()}@example.com`,
    password: await hashPassword("password123"),
  });

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, user };
};

describe("Orders Endpoints", () => {
  let authToken;
  let testUser;
  let testProduct;

  beforeEach(async () => {
    // Clean up
    await OrderItem.destroy({ where: {} });
    await Order.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Setup User
    const authData = await createAuthToken();
    authToken = authData.token;
    testUser = authData.user;

    // Setup Product
    testProduct = await Product.create({
      name: "Test Product",
      price: 100.0,
      stock: 10,
      description: "A test product",
    });
  });

  describe("POST /orders", () => {
    it("should create a new order successfully", async () => {
      const orderData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 2,
          },
        ],
        paymentMethod: "CreditCard",
        paymentDetails: {
          cardNumber: "1234567890123456",
          cvv: "123",
          expirationMonth: "12",
          expirationYear: "2030",
          fullName: "John Doe",
        },
      };

      const res = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      if (res.statusCode !== 201) {
        console.error(
          "Create Order Failed:",
          JSON.stringify(res.body, null, 2)
        );
      }

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.order).toHaveProperty("id");
      expect(Number(res.body.data.order.totalAmount)).toBe(200.0);
      expect(res.body.data.order.status).toBe("completed");

      // Verify Stock Update
      const updatedProduct = await Product.findByPk(testProduct.id);
      expect(updatedProduct.stock).toBe(8);
    });

    it("should fail if stock is insufficient", async () => {
      const orderData = {
        items: [
          {
            productId: testProduct.id,
            quantity: 20, // More than stock (10)
          },
        ],
        paymentMethod: "CreditCard",
        paymentDetails: {
          cardNumber: "1234567890123456",
          cvv: "123",
          expirationMonth: "12",
          expirationYear: "2030",
          fullName: "John Doe",
        },
      };

      const res = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(orderData);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain("Insufficient stock");
    });
  });

  describe("GET /orders", () => {
    it("should return user orders", async () => {
      // Create an order first
      await Order.create({
        userId: testUser.id,
        totalAmount: 100.0,
        status: "completed",
      });

      const res = await request(app)
        .get("/orders")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.orders).toHaveLength(1);
      expect(res.body.data.total).toBe(1);
    });
  });

  describe("GET /orders/:id", () => {
    it("should return order details", async () => {
      const order = await Order.create({
        userId: testUser.id,
        totalAmount: 150.0,
        status: "completed",
      });

      const res = await request(app)
        .get(`/orders/${order.id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.order.id).toBe(order.id);
    });

    it("should return 404 for non-existent order", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const res = await request(app)
        .get(`/orders/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });
  });
});
