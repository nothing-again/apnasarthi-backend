import Razorpay from "razorpay";
import {
  RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET,
} from "../config/dotenv.config.js";

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export const createOrder = async (amount, currency) => {
  const options = {
    amount: amount * 100,
    currency,
  };
  const order = await razorpay.orders.create(options);
  return order.id;
};
