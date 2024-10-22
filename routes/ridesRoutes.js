import express from "express";
import {
    getRiders,
    getRiderById,
    createRider,
    updateRider,
    deleteRider,
} from "../controllers/riderController.js";

const router = express.Router();

router.get("/", getRiders);

router.get("/:id", getRiderById);

router.post("/", createRider);

router.put("/:id", updateRider);

router.delete("/:id", deleteRider);

export default router;
