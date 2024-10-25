import Trip from "../models/tripSchema.js";
import mongoose, { get } from "mongoose";
import { getDistance } from "../utils/getDistance.js";
import Vehicle from "../models/vehicleSchema.js";
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

export const getEstimatedFare = async (req, res) => {
  const { origin, destination } = req.body;
  const distance = getDistance(origin, destination);
  const availableVehicle = await getAvailableVehicle(origin);
  let fareObj = {};

  for (const vehicle of availableVehicle) {
    if (vehicle.type == "auto") {
      const time = new Date().getHours();
      // check if time is between 5 am and 9:30 pm then fare is 17.5/km
      //if time is between 9:31 pm and 11 pm or 3:45 am and 4:59 am then fare is 26/km
      //else fare is 22/km
      let fare = 0;
      if (time >= 5 && time <= 21.5) {
        fare = 17.5 * distance;
      } else if (
        (time >= 21.5 && time <= 23) ||
        (time >= 3.75 && time <= 4.98)
      ) {
        fare = 26 * distance;
      } else {
        fare = 33 * distance;
      }

      fareObj[vehicle.type] = fare;
    }
  }
  res.json(fareObj);
};

export const getAvailableVehicle = async (origin) => {
  const vehicles = await Vehicle.find();
  const availableVehicles = vehicles.filter((vehicle) => {
    const distance = getDistance(vehicle.location, origin);
    return distance < 5000 && vehicle.isAvailable;
  });
  return availableVehicles;
};

//TODO: Implement the rental fare calculation logic
//TODO: Implement the logic to update the trip status
//TODO: Implement the logic to start the trip
//TODO: Implement the logic to end the trip
