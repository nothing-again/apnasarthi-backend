import express from "express";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
import ridesRoutes from "./routes/ridesRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import documentRotes from "./routes/documentRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: "uploads/" });

app.post("/api/upload", upload.single("file"), async (req, res) => {
    console.log(req.file);
    try {
        // Check if a file was included in the request
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Return the secure URL
        res.json({ url: result.secure_url });
    } catch (err) {
        // If there's an error, return it
        res.status(500).json({ error: err.message });
    } finally {
        // Delete the file from the serverx
        fs.unlinkSync(req.file.path);
    }
});

app.use("/api/riders", riderRoutes);
app.use("/api/rides", ridesRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/documents", documentRotes);
app.use("/api/packages", packageRoutes);

export default app;
