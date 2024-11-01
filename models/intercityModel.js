import mongoose from "mongoose";

const Schema = mongoose.Schema;

const IntercitySchema = new Schema({
    origin: {
        type: String,
    },
    destination: {
        type: String,
    },
    noOfPeople: {
        type: Number,
    },
    distance: {
        type: Number,
    },
    duration: {
        type: Number,
    },
    fare: {
        type: Number,
    },
    availableSeats: {
        type: Number,
    },
    departureTime: {
        type: Date,
    },
    arrivalTime: {
        type: Date,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "pending",
    },
    rider: {
        type: Schema.Types.ObjectId,
        ref: "Rider",
    },
    driver: {
        type: Schema.Types.ObjectId,
        ref: "Driver",
    },
    rideSharing: {
        type: Boolean,
        default: false,
    },
});

const Intercity = mongoose.model("Intercity", IntercitySchema);

export default Intercity;
