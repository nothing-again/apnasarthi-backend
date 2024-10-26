import express from "express";
import {
    getRentals,
    getRentalById,
    createRental,
    updateRental,
} from "../controllers/rentalController.js";

const router = express.Router();

router.get("/", getRentals);
router.post("/", createRental);
router.get("/:id", getRentalById);
router.put("/:id", updateRental);

export default router;
