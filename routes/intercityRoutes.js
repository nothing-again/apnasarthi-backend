import express from "express";
import {
    getIntercityByRiderId,
    getIntercityById,
    createIntercity,
    updateIntercity,
    deleteIntercity,
    getIntercityByDriverId,
    getIntercityByStatus,
    getEstimatedFare,
} from "../controllers/intercityController.js";

const router = express.Router();

router.route("/rider/:riderId").get(getIntercityByRiderId);
router.route("/driver/:driverId").get(getIntercityByDriverId);
router.route("/status/:status").get(getIntercityByStatus);
router.route("/estimate").post(getEstimatedFare);
router
    .route("/:id")
    .get(getIntercityById)
    .put(updateIntercity)
    .delete(deleteIntercity);
router.route("/").post(createIntercity);

export default router;
