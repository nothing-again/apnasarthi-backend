import Trip from "../models/tripSchema.js";
import mongoose from "mongoose";

export const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find();
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (trip) {
            res.json(trip);
        } else {
            res.status(404).json({ message: "Trip not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTrip = async (req, res) => {
    const { riderId, driverId, origin, destination, fare } = req.body;

    if (!riderId || !driverId || !origin || !destination || !fare) {
        return res
            .status(400)
            .json({ message: "Please provide all required fields" });
    }

    const newTrip = new Trip({
        rider: riderId,
        driver: driverId,
        origin,
        destination,
        fare,
    });

    try {
        await newTrip.save();
        res.status(201).json(newTrip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
