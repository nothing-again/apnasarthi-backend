import express from "express";
import {
    createPackageTrip,
    getPackageTrips,
    getPackageTripById,
    updatePackageTrip,
    deletePackageTrip,
} from "../controllers/packageController.js";

const router = express.Router();

router.get("/", getPackageTrips);
router.post("/", createPackageTrip);
router.get("/:id", getPackageTripById);
router.put("/:id", updatePackageTrip);
router.delete("/:id", deletePackageTrip);

export default router;
