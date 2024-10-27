import express from "express";
import {
    createTrip,
    getTripById,
    getTrips,
    getTripByDriverId,
    getTripByRiderId,
    getEstimatedFare,
    createInterCityTrip,
    confirmTrip,
    cancelTrip,
    pendingTrips,
} from "../controllers/rideController.js";

const router = express.Router();

router.get("/", getTrips);
router.get("/pending", pendingTrips);
router.post("/confirm", confirmTrip);
router.post("/", createTrip);
router.post("/estimate", getEstimatedFare);

router.post("/intercity", createInterCityTrip);

router.get("/:id", getTripById);
router.get("/rider/:riderId", getTripByRiderId);
router.get("/driver/:driverId", getTripByDriverId);
router.post("/cancel", cancelTrip);

export default router;
