const Order = require("../models/order");

class orderController {
  // Create new order
  static createOrder = async (req, res) => {
    try {
      const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

      if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: "No order items" });
      }

      const order = new Order({
        user: req.user.id,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
      });

      const savedOrder = await order.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  // Get all orders (Admin only)
  static getOrders = async (req, res) => {
    try {
      const orders = await Order.find().populate("user", "name email");
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  // Get logged in user's orders
  static getMyOrders = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user.id });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  // Update delivery status (Admin only)
  static updateDelivery = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      order.isDelivered = true;
      await order.save();
      res.json({ message: "Order delivered", order });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
}

module.exports = orderController;
