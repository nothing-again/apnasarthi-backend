import express from "express";
import { generateOrderId } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/order", generateOrderId);

export default router;
