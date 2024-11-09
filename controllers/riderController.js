import Package from "../models/packageModel.js";
import Rider from "../models/riderModel.js";
import Trip from "../models/tripSchema.js";
import { sendOTP } from "../services/otpService.js";
export const getRiders = async (req, res) => {
  try {
    const riders = await Rider.find();
    res.status(200).json({ riders });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getRiderById = async (req, res) => {
  const { id } = req.params;
  try {
    const rider = await Rider.findById(id);
    res.status(200).json({ rider });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const createRider = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  console.log("firstName", firstName);
  console.log("lastName", lastName);
  console.log("email", email);
  console.log("password", password);
  if (!firstName || !lastName || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newRider = new Rider({
      firstName,
      lastName,
      email,
      password,
      phone,
    });
    await newRider.save(); // Await the save operation

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpResponse = await sendOTP(phone, otp);

    if (otpResponse.status === 200) {
      console.log("OTP sent successfully:", otpResponse.data);
      newRider.otp = otp;
      console.log("newRider.otp", newRider.otp);
      await newRider.save();
      console.log("newRider", newRider);
      return res.status(201).json(newRider);
    } else {
      return res.status(500).json({ error: otpResponse });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(409).json({ message: error.message });
  }
};

export const updateRider = async (req, res) => {
  const { id } = req.params;
  const rider = req.body;
  try {
    const updatedRider = await Rider.findByIdAndUpdate(id, rider, {
      new: true,
    });
    res.status(200).json({ updatedRider });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteRider = async (req, res) => {
  const { id } = req.params;
  try {
    await Rider.findByIdAndRemove(id);
    res.status(200).json({ message: "Rider deleted successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { phone } = req.body;
  try {
    const rider = await Rider.findOne({ phone });
    if (!rider) {
      return res.status(404).json({ message: "Rider not found" });
    }
    try {
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpResponse = await sendOTP(phone, otp);
      if (otpResponse.status == 200) {
        rider.otp = otp;
        await rider.save();
      } else {
        res.status(500).json({ error: otpResponse });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    res.status(200).json(rider);
  } catch (error) {
    console.log({
      error,
    });
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { id, otp } = req.body;
  try {
    const rider = await Rider.findById(id);
    if (rider.otp == otp) {
      return res.status(200).json({ rider });
    } else {
      return res.status(404).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRiderLocation = async (req, res) => {
  const { riderId, lat, long } = req.body;
  try {
    const rider = await Rider.findById(riderId);
    if (!rider) {
      return res.status(400).json({ message: "Rider not found" });
    }
    rider.location = {
      latitude: lat,
      longitude: long,
    };
    await rider.save();

    res.status(200).json(rider);
  } catch (error) {
    console.log({
      message: error.message,
    });
    res.status(500).json({ message: error.message });
  }
};

export const getRiderLocation = async (req, res) => {
  const { tripId } = req.body;
  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(400).json({ message: "Trip not found" });
    }
    const rider = await Rider.findById(trip.rider);
    if (!rider) {
      return res.status(400).json({ message: "Rider not found" });
    }
    res.status(200).json(rider.location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeTrip = async (req, res) => {
  const { tripId } = req.body;
  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(400).json({ message: "Trip not found" });
    }
    trip.status = "completed";
    await trip.save();
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completePackage = async (req, res) => {
  const { tripId } = req.body;
  try {
    const trip = await Package.findById(tripId);
    if (!trip) {
      return res.status(400).json({ message: "Package not found" });
    }
    trip.status = "completed";
    await trip.save();
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
