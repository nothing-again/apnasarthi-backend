import Driver from "../models/driverModel.js";
import Package from "../models/packageModel.js";
import Trip from "../models/tripSchema.js";
import { sendOTP } from "../services/otpService.js";
import mongoose from "mongoose";
export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDriverById = async (req, res) => {
  const { id } = req.params;
  try {
    const driver = await Driver.findById(id);
    res.status(200).json(driver);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createDriver = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  const driver = { firstName, lastName, email, password, phone };

  const newDriver = new Driver(driver);
  try {
    const user = await newDriver.save();
    console.log(user);
    // Send OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    try {
      const otpResponse = await sendOTP(phone, otp);
      if (otpResponse.status == 200) {
        newDriver.otp = otp;
        await newDriver.save();
        res.status(201).json(newDriver);
      } else {
        res.status(500).json({ error: otpResponse });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateDriver = async (req, res) => {
  const { id } = req.params;
  const driver = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No driver with id: ${id}`);
  const updatedDriver = await Driver.findByIdAndUpdate(
    id,
    { ...driver, id },
    { new: true }
  );
  res.json(updatedDriver);
};

export const deleteDriver = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No driver with id: ${id}`);
  await Driver.findByIdAndRemove(id);
  res.json({ message: "Driver deleted successfully." });
};

export const loginDriver = async (req, res) => {
  const { phone } = req.body;
  console.log("phone", phone);
  try {
    const driver = await Driver.findOne({ phone });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    // console.log("driver", driver);
    // res.status(200).json(driver);
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpResponse = await sendOTP(phone, otp);
    if (otpResponse.status === 200) {
      driver.otp = otp;
      await driver.save();
      console.log("driver", driver);
      return res.status(200).json(driver);
    } else {
      console.log("otpResponse", otpResponse);
      return res.status(500).json({ error: otpResponse });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { id, otp } = req.body;

  try {
    const driver = await Driver.findById(id);
    if (!driver) return res.status(404).send(`No driver with id: ${id}`);
    if (driver.otp === otp) {
      driver.isVerified = true;
      await driver.save();
      return res.status(200).json("message: OTP verified successfully");
    }
    res.status(200).json("message: OTP verified successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { latitude, longitude } = req.body;
  try {
    const driver = await Driver.findByIdAndUpdate(
      id,
      { location: { type: "Point", coordinates: [longitude, latitude] } },
      { new: true }
    );
    res.status(200).json(driver);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateAvailability = async (req, res) => {
  const { id } = req.params;
  const { isAvailable } = req.body;
  try {
    const driver = await Driver.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true }
    );
    res.status(200).json(driver);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateFarePerKm = async (req, res) => {
  const { id } = req.params;
  const { farePerKm } = req.body;
  try {
    const driver = await Driver.findByIdAndUpdate(
      id,
      { farePerKm },
      { new: true }
    );

    res.status(200).json(driver);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateFarePerDay = async (req, res) => {
  const { id } = req.params;
  const { farePerDay } = req.body;
  try {
    const driver = await Driver.findByIdAndUpdate(
      id,
      { farePerDay },
      { new: true }
    );
    res.status(200).json(driver);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateDriverLocation = async (req, res) => {
  const { driverId, lat, long } = req.body;

  try {
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    driver.location.latitude = lat;
    driver.location.longitude = long;
    await driver.save();
    res.status(200).json(driver);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDriverLocation = async (req, res) => {
  const { tripId } = req.body;
  try {
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    const driver = await Driver.findById(trip.driver);
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    res.status(200).json(driver.location);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const progressTrip = async (req, res) => {
  const { tripId } = req.body;
  try {
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    trip.status = "in_progress";
    trip.startedAt = new Date();
    await trip.save();
    res.status(200).json(trip);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const progressPackageTrip = async (req, res) => {
  const { packageId } = req.body;
  try {
    const trip = await Package.findById(packageId);
    if (!trip) return res.status(404).json({ message: "Package not found" });
    trip.status = "in_progress";
    trip.startedAt = new Date();
    await trip.save();
    res.status(200).json(trip);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
