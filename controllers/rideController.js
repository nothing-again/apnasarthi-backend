import Trip from "../models/tripSchema.js";
import mongoose, { get } from "mongoose";
import { getDistance } from "../utils/getDistance.js";
import Vehicle from "../models/vehicleSchema.js";
import Driver from "../models/driverModel.js";
import Rider from "../models/riderModel.js";
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
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    if (trip.status === "accepted") {
      const driver = await Driver.findById(trip.driver);
      const vehicle = await Vehicle.findById(driver?.vehicle);
      const rider = await Rider.findById(trip.rider);
      let resObj = {
        tripId: trip._id,
        origin: trip.origin,
        destination: trip.destination,
        fare: trip.fare,
        status: trip.status,
        vehicleNumber: vehicle?.vehicleNumber,
        vehicleType: vehicle?.vehicleType,
        firstName: driver?.firstName,
        lastName: driver?.lastName,
        phone: driver?.phone,
        riderName: rider?.firstName + " " + rider?.lastName,
        riderPhone: rider?.phone,
        driverLocation: driver?.location,
        riderLocation: rider?.location,
      };
      console.log(resObj);
      return res.json(resObj);
    }

    return res.json(trip);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTripsByRiderId = async (req, res) => {
  const { riderId } = req.params;

  try {
    const trips = await Trip.find({ rider: riderId })
      .populate({
        path: "driver",
        select: "firstName lastName phone vehicle",
        populate: {
          path: "vehicle",
          select: "vehicleNumber vehicleType",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    if (!trips || trips.length === 0) {
      return res.status(404).json({ message: "Trips not found" });
    }

    const rider = await Rider.findById(riderId)
      .select("firstName lastName phone")
      .lean();

    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }

    const tripDetails = trips.map((trip) => ({
      tripId: trip._id,
      origin: trip.origin,
      destination: trip.destination,
      fare: trip.fare,
      status: trip.status,
      vehicleNumber: trip.driver?.vehicle?.vehicleNumber,
      vehicleType: trip.driver?.vehicle?.vehicleType,
      driverFirstName: trip.driver?.firstName,
      driverLastName: trip.driver?.lastName,
      driverPhone: trip.driver?.phone,
      riderName: `${rider.firstName} ${rider.lastName}`,
      riderPhone: rider.phone,
      createdAt: trip.createdAt,
    }));

    res.json(tripDetails);
  } catch (error) {
    console.error("Error fetching trips:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch trips. Please try again later." });
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

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?units=metric&origin=${encodeURIComponent(
        origin
      )}&destination=${encodeURIComponent(destination)}&key=${
        process.env.GOOGLE_MAPS_API_KEY
      }`
    );

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return res.status(400).json({
        error: "No route found between the specified origin and destination.",
        origin,
        destination,
      });
    }

    const distance = data.routes[0].legs[0].distance.value / 1000;

    let fareObj = [
      {
        vehicleType: "auto",
        fare: distance * 17.5,
      },
      {
        vehicleType: "bike",
        fare: distance * 10,
      },
      {
        vehicleType: "car",
        fare: distance * 25,
      },
    ];

    res.json(fareObj);
  } catch (error) {
    console.error("Error fetching directions:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch directions. Please try again later." });
  }
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

export const pendingTrips = async (_, res) => {
  try {
    const trips = await Trip.find({
      status: "pending",
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmTrip = async (req, res) => {
  const { driverId, tripId } = req.body;
  console.log("driverId", driverId);
  console.log("tripId", tripId);
  try {
    const driver = await Driver.findById({ _id: driverId });

    if (!driver) {
      return res.status(400).json({ message: "Driver is not available" });
    }

    const trip = await Trip.findById({ _id: tripId });

    if (!trip) {
      return res.status(400).json({ message: "Trip not found" });
    }

    trip.driver = driverId;
    trip.status = "accepted";
    await trip.save();

    driver.isAvailable = false;
    await driver.save();

    const vehicleId = driver.vehicle;

    const vehicle = await Vehicle.findById(vehicleId);

    const resObj = {
      tripId: trip._id,
      origin: trip.origin,
      destination: trip.destination,
      fare: trip.fare,
      status: trip.status,
      vehicleNumber: vehicle?.vehicleNumber,
      vehicleType: vehicle?.vehicleType,
      firstName: driver.firstName,
      lastName: driver.lastName,
      phone: driver.phone,
    };
    // send a response containing trip details and driver details
    res.json(resObj);
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
