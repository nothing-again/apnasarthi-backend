import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true,
    },

    vehicleType: {
        type: String,
        required: true,
    },

    carModel: {
        type: String,
        required: true,
    },

    carYear: {
        type: Number,
        required: true,
    },

    registrationNumber: {
        type: String,
        required: true,
    },

    insuranceNumber: {
        type: String,
        required: true,
    },

    documents: {
        registrationCertificate: {
            type: String,
            required: true,
        },
        insurance: {
            type: String,
            required: true,
        },
    },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
