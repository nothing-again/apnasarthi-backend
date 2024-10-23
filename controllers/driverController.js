import Driver from "../models/driverModel.js";
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
        //send otp
        const otp = Math.floor(100000 + Math.random() * 900000);
        try {
            const res = await sendOTP(phone, otp);
            if (res.status == 200) {
                newDriver.otp = otp;
                await newDriver.save();
                res.status(201).json(newDriver);
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
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
    const { email, password } = req.body;
    try {
        const driver = await Driver.findOne({ email });
        if (!driver)
            return res.status(404).json({ message: "Driver not found" });
        if (driver.password !== password)
            return res.status(404).json({ message: "Invalid credentials" });
        res.status(200).json(driver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    const { id, otp } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(404).send(`No driver with id: ${id}`);
        const driver = await Driver.findById(id);
        if (driver.otp === otp) {
            driver.isVerified = true;
            await driver.save();
            res.status(200).json("message: OTP verified successfully");
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};
