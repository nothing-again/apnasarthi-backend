import express from "express";
import {
    createTrip,
    getTripById,
    getTrips,
} from "../controllers/rideController.js";

const router = express.Router();

router.get("/", getTrips);
router.post("/", createTrip);
router.get("/:id", getTripById);

export default router;
