import express from "express";
import {
  createTrip,
  getTripById,
  getTrips,
  getTripByDriverId,
  getTripsByRiderId,
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

router.get("/rider/:riderId", getTripsByRiderId);
router.get("/driver/:driverId", getTripByDriverId);
router.get("/:id", getTripById);
router.post("/cancel", cancelTrip);

export default router;
