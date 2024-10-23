import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true,
    },

    vehicleType: {
        type: String,
    },

    carModel: {
        type: String,
    },

    carYear: {
        type: Number,
    },

    registrationNumber: {
        type: String,
    },

    insuranceNumber: {
        type: String,
    },

    insuranceExpiry: {
        type: Date,
    },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
