import Trip from "../models/tripSchema.js";
import mongoose, { get } from "mongoose";
import { getDistance } from "../utils/getDistance.js";
import Vehicle from "../models/vehicleSchema.js";
import Driver from "../models/driverModel.js";
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
            if (trip.status === "accepted") {
                const driver = await Driver.findById(trip.driver);
                res.json({ trip, driver });
            }
            res.json(trip);
        } else {
            res.status(404).json({ message: "Trip not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTripByRiderId = async (req, res) => {
    try {
        const trips = await Trip.find({ rider: req.params.riderId });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTripByDriverId = async (req, res) => {
    try {
        const trips = await Trip.find({ driver: req.params.driverId });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTrip = async (req, res) => {
    const { riderId, origin, destination, fare, paymentStatus } = req.body;

    if (!riderId || !origin || !destination || !fare || !paymentStatus) {
        return res
            .status(400)
            .json({ message: "Please provide all required fields" });
    }

    console.log("riderId", riderId);
    console.log("origin", origin);
    console.log("destination", destination);
    console.log("fare", fare);
    console.log("paymentStatus", paymentStatus);

    const newTrip = new Trip({
        rider: riderId,
        origin,
        destination,
        fare,
        paymentStatus,
    });

    try {
        await newTrip.save();
        res.status(201).json(newTrip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const createInterCityTrip = async (req, res) => {
    res.json({ message: "InterCity Trip Created" });
};

export const createRentalTrip = async (req, res) => {
    res.json({ message: "Rental Trip Created" });
};

export const getEstimatedFare = async (req, res) => {
    const { origin, destination } = req.body;
    // const distance = getDistance(origin, destination);
    const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();
    const distance = data.rows[0].elements[0].distance.value / 1000;

    const availableVehicle = await getAvailableVehicle(origin);
    // let fareObj = {};

    // for (const vehicle of availableVehicle) {
    //     if (vehicle.type == "auto") {
    //         const time = new Date().getHours();
    //         // check if time is between 5 am and 9:30 pm then fare is 17.5/km
    //         //if time is between 9:31 pm and 11 pm or 3:45 am and 4:59 am then fare is 26/km
    //         //else fare is 22/km
    //         let fare = 0;
    //         if (time >= 5 && time <= 21.5) {
    //             fare = 17.5 * distance;
    //         } else if (
    //             (time >= 21.5 && time <= 23) ||
    //             (time >= 3.75 && time <= 4.98)
    //         ) {
    //             fare = 26 * distance;
    //         } else {
    //             fare = 33 * distance;
    //         }

    //         fareObj[vehicle.type] = fare;
    //     }
    // }
    //Mock response
    let fareObj = [
        {
            vehicleType: "auto",
            fare: 1,
        },
        {
            vehicleType: "bike",
            fare: 5,
        },
        {
            vehicleType: "mini-truck",
            fare: 15,
        },
    ];
    res.json(fareObj);
};

export const getAvailableVehicle = async (origin) => {
    const vehicles = await Vehicle.find();
    const availableVehicles = vehicles.filter(async (vehicle) => {
        // const distance = getDistance(vehicle.location, origin);
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${vehicle.location}&destinations=${origin}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        const distance = data.rows[0].elements[0].distance.value / 1000;
        return distance < 5000 && vehicle.isAvailable;
    });
    return availableVehicles;
};

export const pendingTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ status: "pending" });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const confirmTrip = async (req, res) => {
    const { driverId, tripId } = req.body;
    try {
        const driver = await Driver.findById({
            _id: mongoose.Types.ObjectId(driverId),
        });

        if (!driver) {
            return res.status(400).json({ message: "Driver is not available" });
        }

        const trip = await Trip.findById(tripId);

        if (!trip) {
            return res.status(400).json({ message: "Trip not found" });
        }

        trip.driver = driverId;
        trip.status = "accepted";
        await trip.save();

        driver.isAvailable = false;
        await driver.save();

        // send a response containing trip details and driver details
        res.json({ trip, driver });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const cancelTrip = async (req, res) => {
    const { tripId } = req.body;
    try {
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(400).json({ message: "Trip not found" });
        }
        trip.status = "cancelled";
        await trip.save();
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//TODO: Implement the rental fare calculation logic
//TODO: Implement the logic to update the trip status
//TODO: Implement the logic to start the trip
//TODO: Implement the logic to end the trip
