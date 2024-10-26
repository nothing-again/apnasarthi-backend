import mongoose from "mongoose";

const packageSchema = mongoose.Schema({
    origin: {
        type: String,
    },
    destination: {
        type: String,
    },
    weight: {
        type: Number,
    },
    vehicleType: {
        type: String,
    },
    date: {
        type: Date,
    },
    time: {
        type: String,
    },
    status: {
        type: String,
        default: "pending",
    },
    rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rider",
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
    },
    fare: {
        type: Number,
    },
    timestamp: {
        type: Date,
        default: new Date(),
    },
});

const Package = mongoose.model("Package", packageSchema);

export default Package;
