import express from "express";

import {
    getEstimatedFare,
    createPooling,
} from "../controllers/poolingController.js";

const router = express.Router();

router.route("/estimate").post(getEstimatedFare);
router.route("/").post(createPooling);

export default router;
