import express from "express";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rider api routes
app.use("/api/riders", riderRoutes);
app.use("/api/payments", paymentRoutes);

export default app;
