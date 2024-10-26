import express from "express";
import {
    getRentals,
    getRentalById,
    createRental,
    updateRental,
    deleteRental,
    getPendingRentals,
    getRentalByDriver,
    getRentalByRider,
    getRentalPrice,
} from "../controllers/rentalController.js";

const router = express.Router();

router.get("/", getRentals);
router.post("/", createRental);
router.get("/:id", getRentalById);
router.put("/:id", updateRental);
router.delete("/:id", deleteRental);
router.get("/pending", getPendingRentals);
router.get("/rider/:id", getRentalByRider);
router.get("/driver/:id", getRentalByDriver);
router.get("/price", getRentalPrice);

export default router;
