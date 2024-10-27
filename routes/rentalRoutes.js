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
    confirmRental,
} from "../controllers/rentalController.js";

const router = express.Router();

router.get("/", getRentals);
router.post("/", createRental);
router.post("/pending", getPendingRentals);
router.post("/confirm", confirmRental);
router.get("/:id", getRentalById);
router.put("/:id", updateRental);
router.delete("/:id", deleteRental);
router.get("/rider/:id", getRentalByRider);
router.get("/driver/:id", getRentalByDriver);
router.get("/price", getRentalPrice);

export default router;
