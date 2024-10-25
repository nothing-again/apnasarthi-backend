import express from "express";
import {
  createTrip,
  getTripById,
  getTrips,
  getTripByDriverId,
  getTripByRiderId,
  getEstimatedFare,
} from "../controllers/rideController.js";

const router = express.Router();

router.get("/", getTrips);
router.post("/", createTrip);
router.post("/estimate", getEstimatedFare);
router.get("/:id", getTripById);
router.get("/rider/:riderId", getTripByRiderId);
router.get("/driver/:driverId", getTripByDriverId);

export default router;
