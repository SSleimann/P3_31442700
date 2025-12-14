import sequelize from "../config/database.js";
import OrderRepository from "../repositories/orders.repository.js";
import Product from "../models/product.js";
import { CreditCardStrategy } from "../utils/payments.js";

class OrderService {
  async createOrder(userId, items, paymentMethod, paymentDetails) {
    const t = await sequelize.transaction();
    try {
      if (!items || items.length === 0) {
        throw new Error("No items provided");
      }

      // Consolidate duplicate items
      const itemMap = new Map();
      for (const item of items) {
        if (itemMap.has(item.productId)) {
          const existing = itemMap.get(item.productId);
          existing.quantity += item.quantity;
        } else {
          itemMap.set(item.productId, { ...item });
        }
      }
      const uniqueItems = Array.from(itemMap.values());

      let totalAmount = 0;
      const orderItems = [];

      for (const item of uniqueItems) {
        const product = await Product.findByPk(item.productId, {
          transaction: t,
        });
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        const itemTotal = Number(product.price) * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
        });
      }

      let paymentStrategy;
      if (paymentMethod === "CreditCard") {
        paymentStrategy = new CreditCardStrategy();
      } else {
        throw new Error("Unsupported payment method");
      }

      // Prepare payment data
      const paymentData = {
        amount: totalAmount,
        currency: paymentDetails.currency || "USD",
        description: `Order for user ${userId}`,
        reference: `ORDER-${Date.now()}`,
        ...paymentDetails,
      };

      await paymentStrategy.processPayment(paymentData);

      for (const item of uniqueItems) {
        await Product.decrement("stock", {
          by: item.quantity,
          where: { id: item.productId },
          transaction: t,
        });
      }

      // 4. Create Order
      const orderData = {
        userId,
        totalAmount,
        status: "completed",
      };

      const newOrder = await OrderRepository.createOrder(
        orderData,
        orderItems,
        t
      );

      await t.commit();
      return newOrder;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getOrdersByUserId(userId, page, limit) {
    return await OrderRepository.getOrdersByUserId(userId, page, limit);
  }

  async getOrderById(id) {
    return await OrderRepository.getOrderById(id);
  }
}

export default new OrderService();
