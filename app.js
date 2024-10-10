import express from "express";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/payments", paymentRoutes);

export default app;
