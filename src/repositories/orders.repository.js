import Order from "../models/orders.js";
import OrderItem from "../models/orderItem.js";
import Product from "../models/product.js";

class OrderRepository {
  async createOrder(orderData, items, transaction) {
    const order = await Order.create(orderData, { transaction });

    const orderItemsData = items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    await OrderItem.bulkCreate(orderItemsData, { transaction });

    return await this.getOrderById(order.id, transaction);
  }

  async getOrdersByUserId(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return await Order.findAndCountAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price", "slug"],
            },
          ],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      distinct: true, // Important for correct count with includes
    });
  }

  async getOrderById(id, transaction = null) {
    return await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price", "slug"],
            },
          ],
        },
      ],
      transaction,
    });
  }
}

export default new OrderRepository();
