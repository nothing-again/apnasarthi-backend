import { createOrder } from "../services/razorpayService.js";

export const generateOrderId = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const orderId = await createOrder(amount, currency);
    res.status(200).json({ orderId });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate order ID" });
  }
};
