import OrderService from "../services/order.service.js";

export const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, paymentDetails } = req.body;
    const userId = req.user.id;

    const newOrder = await OrderService.createOrder(
      userId,
      items,
      paymentMethod,
      paymentDetails
    );

    res.status(201).json({
      status: "success",
      data: { order: newOrder },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const result = await OrderService.getOrdersByUserId(
      userId,
      Number(page),
      Number(limit)
    );

    res.status(200).json({
      status: "success",
      data: {
        orders: result.rows,
        total: result.count,
        page: Number(page),
        totalPages: Math.ceil(result.count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await OrderService.getOrderById(id);

    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }

    if (order.userId !== userId) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to view this order",
      });
    }

    res.status(200).json({
      status: "success",
      data: { order },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
