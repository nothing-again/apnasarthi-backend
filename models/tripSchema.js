import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
    {
        rider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rider",
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
        },
        origin: {
            type: String,
        },
        destination: {
            type: String,
        },
        fare: {
            type: Number,
        },
        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "in_progress",
                "completed",
                "cancelled",
            ],
            default: "pending",
        },
        startedAt: {
            type: Date,
        },
        completedAt: {
            type: Date,
        },
        paymentStatus: {
            type: String,
            enum: ["paid", "unpaid"],
            default: "unpaid",
        },
    },
    {
        timestamps: true,
    }
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
