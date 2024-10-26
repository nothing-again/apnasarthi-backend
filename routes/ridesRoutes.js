import express from "express";
import {
    createTrip,
    getTripById,
    getTrips,
    getTripByDriverId,
    getTripByRiderId,
    getEstimatedFare,
    createInterCityTrip,
    createPackageTrip,
    createRentalTrip,
} from "../controllers/rideController.js";

const router = express.Router();

router.get("/", getTrips);
router.post("/", createTrip);
router.post("/estimate", getEstimatedFare);

router.post("/intercity", createInterCityTrip);
router.post("/package", createPackageTrip);
router.post("/rental", createRentalTrip);

router.get("/:id", getTripById);
router.get("/rider/:riderId", getTripByRiderId);
router.get("/driver/:driverId", getTripByDriverId);

export default router;
