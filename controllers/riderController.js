import Rider from "../models/riderModel.js";

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

  if (!firstName || !lastName || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newRider = new Rider({ firstName, lastName, email, password, phone });
    newRider.save();
    // const otp = Math.floor(100000 + Math.random() * 900000);
    // try {
    //     const otpResponse = await sendOTP(phone, otp);
    //     if (otpResponse.status == 200) {
    //         newRider.otp = otp;
    //         await newRider.save();
    //     } else {
    //         res.status(500).json({ error: otpResponse });
    //     }
    // } catch (error) {
    //     res.status(500).json({ error: error });
    // }
    res.status(201).json(newRider);
  } catch (error) {
    res.status(409).json({ message: error.message });
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
    // try {
    //     const otp = Math.floor(100000 + Math.random() * 900000);
    //     const otpResponse = await sendOTP(phone, otp);
    //     if (otpResponse.status == 200) {
    //         rider.otp = otp;
    //         await rider.save();
    //     } else {
    //         res.status(500).json({ error: otpResponse });
    //     }
    // } catch (error) {
    //     res.status(500).json({ message: error.message });
    // }
    res.status(200).json(rider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { id, otp } = req.body;
  try {
    const rider = await Rider.findById(id);
    // if (rider.otp == otp) {
    //     res.status(200).json({ rider });
    // } else {
    //     res.status(404).json({ message: "Invalid OTP" });
    // }
    res.status(200).json(rider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
