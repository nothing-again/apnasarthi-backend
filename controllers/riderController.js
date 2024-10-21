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
    const [firstName, lastName, email, password, phone] = req.body;

    if (!firstName || !lastName || !email || !password || !phone) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newRider = new Rider({ firstName, lastName, email, password, phone });

    try {
        await newRider.save();
        res.status(201).json({ newRider });
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
