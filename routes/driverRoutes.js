import express from "express";
import {
    getDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
    loginDriver,
} from "../controllers/driverController.js";

const router = express.Router();

router.route("/").get(getDrivers).post(createDriver);
router.route("/login").post(loginDriver);
router.route("/:id").get(getDriverById).put(updateDriver).delete(deleteDriver);

export default router;
