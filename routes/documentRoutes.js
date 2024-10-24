import { createDocument } from "../controllers/documentController.js";
import express from "express";
const router = express.Router();

router.post("/", createDocument);

export default router;
