import express from "express";
import {
  getRiders,
  getRiderById,
  createRider,
  updateRider,
  deleteRider,
  verifyOtp,
  login,
  updateRiderLocation,
  getRiderLocation,
  completeTrip,
  completePackage,
} from "../controllers/riderController.js";

const router = express.Router();

router.get("/", getRiders);

router.get("/getLocation", getRiderLocation);

router.put("/updateLocation", updateRiderLocation);

router.get("/:id", getRiderById);

router.post("/", createRider);

router.put("/:id", updateRider);

router.delete("/:id", deleteRider);

router.route("/verifyOtp").post(verifyOtp);

router.route("/login").post(login);

router.route("/completeTrip").post(completeTrip);

router.route("/completePackageTrip").post(completePackage);

export default router;
