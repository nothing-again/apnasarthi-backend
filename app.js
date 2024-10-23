import express from "express";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";
import riderRoutes from "./routes/riderRoutes.js";
import ridesRoutes from "./routes/ridesRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.post("/api/upload", (req, res) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const dir = "./uploads";
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    });

    const upload = multer({ storage: storage }).array("files", 10); // Accepts up to 10 files

    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send({ message: "Error uploading file" });
        }

        // Upload files to Cloudinary
        const files = req.files;
        const promises = files.map((file) => {
            return new Promise((resolve, reject) => {
                cloudinary.v2.uploader.upload(file.path, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                });
            });
        });

        Promise.all(promises)
            .then((urls) => {
                res.send(urls);
            })
            .catch((error) => {
                res.status(400).send({
                    message: "Error uploading files to Cloudinary",
                });
            });
    });
});

app.use("/api/riders", riderRoutes);
app.use("/api/rides", ridesRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/vehicles", vehicleRoutes);

export default app;
