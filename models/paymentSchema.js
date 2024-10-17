import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rider",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["card", "paypal", "googlepay", "applepay"],
      required: true,
    },
    status: {
      type: String,
      enum: ["successful", "failed", "pending"],
      default: "pending",
    },
    transactionId: String,
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
