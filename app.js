import express from "express";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
import ridesRoutes from "./routes/ridesRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/riders", riderRoutes);
app.use("/api/rides", ridesRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/payments", paymentRoutes);

export default app;
