import mongoose from "mongoose";

const rentalSchema = mongoose.Schema({
    pickupPoint: {
        type: String,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    vehicleType: {
        type: String,
    },
    fare: {
        type: Number,
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
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
    },
});

const Rental = mongoose.model("Rental", rentalSchema);

export default Rental;
