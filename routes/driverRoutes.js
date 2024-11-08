import express from "express";
import {
    getDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
    loginDriver,
    verifyOtp,
    updateAvailability,
    updateLocation,
    updateFarePerDay,
    updateFarePerKm,
    updateDriverLocation,
    getDriverLocation,
} from "../controllers/driverController.js";

const router = express.Router();

router.route("/").get(getDrivers).post(createDriver);
router.route("/getDriverLocation").post(getDriverLocation);
router.route("/updateDriverLocation").put(updateDriverLocation);
router.route("/login").post(loginDriver);
router.route("/verifyOtp").post(verifyOtp);
router.route("/updateLocation/:id").put(updateLocation);
router.route("/updateAvailability/:id").put(updateAvailability);
router.route("/updateFarePerKm/:id").put(updateFarePerKm);
router.route("/updateFarePerDay/:id").put(updateFarePerDay);
router.route("/:id").get(getDriverById).put(updateDriver).delete(deleteDriver);

export default router;
