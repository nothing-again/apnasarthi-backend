import express from "express";
import {
    createPackageTrip,
    getPackageTrips,
    getPackageTripById,
    updatePackageTrip,
    deletePackageTrip,
    getPendingPackageTrips,
    confirmPackageTrip,
    getPackageTripByDriverId,
    getPackageTripByRiderId,
    estimatePackage,
} from "../controllers/packageController.js";

const router = express.Router();

router.get("/", getPackageTrips);
router.get("/pending", getPendingPackageTrips);
router.post("/confirm", confirmPackageTrip);
router.post("/estimate", estimatePackage);
router.get("/driver/:id", getPackageTripByDriverId);
router.get("/rider/:id", getPackageTripByRiderId);
router.post("/", createPackageTrip);
router.get("/:id", getPackageTripById);
router.put("/:id", updatePackageTrip);
router.delete("/:id", deletePackageTrip);

export default router;
